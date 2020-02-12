import { NodeOptions, Node } from './Node';
import { Utils } from '../common/Utils';
import { Event } from '../events/Event';
import { detectTarget } from './detectTarget';
import { SizingStrategy, Sizing } from './Sizing';
import { Schedule } from '../common/Schedule';

export interface PointerEventData {
    id: number;
    x: number;
    y: number;
    timeStamp: number;
}

export type PointerEvent = Event<PointerEventData>;

export interface WheelEventData extends PointerEventData {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    deltaMode: number;
}

export type WheelEvent = Event<WheelEventData>;

export type RootOptions = NodeOptions & Partial<{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    sizing: SizingStrategy | null;
    sizingDelay: number;
    margin: number;
}>;

export class Root extends Node implements Required<RootOptions> {

    static defaults: RootOptions = {
        sizing: Sizing.Contain,
        sizingDelay: 200,
        margin: 0
    };

    static eventOptions: AddEventListenerOptions = {
        passive: true,
    };

    constructor(options?: Readonly<RootOptions>) {
        super();

        Object.assign(this, Root.defaults, options);

        let { canvas } = this;
        if (!canvas) {
            this.canvas = canvas = document.createElement('canvas');
        }
        this.context = canvas.getContext('2d')!;

        if (!this.width) {
            this.width = canvas.width;
        }
        if (!this.height) {
            this.height = canvas.height;
        }

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onWheel = this._onWheel.bind(this);

        this.addListener('pointerdown', (event: PointerEvent) => {
            this.pointerInit.set(event.data.id, event);
        }).addListener('pointerup', (event: PointerEvent) => {
            const { data } = event,
                init = this.pointerInit.get(data.id);
            if (init) {
                if (event.target === init.target) {
                    event.target!.dispatchEvent(new Event('click', event));
                }
                this.pointerInit.delete(data.id);
            }
        });

        if (this.interactive) {
            this.attachListeners();
        }

        window.addEventListener(
            'resize',
            this.resize = Utils.debounce(
                function resize(this: Root) {
                    if (this.canvas.parentNode) {
                        this._resize();
                        Schedule.mark(this);
                    }
                },
                this.sizingDelay,
                this
            )
        );

    }

    readonly tag = 'root';
    readonly canvas!: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly sizingDelay!: number;
    readonly resize: () => void;
    readonly pointerInit = new Map<number, PointerEvent>();
    width!: number;
    height!: number;
    sizing!: SizingStrategy | null;
    margin!: number;
    private _scale = 1;
    private _listenerAttached = false;
    private _clientX = 0;
    private _clientY = 0;

    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    private _resize() {
        const { canvas, sizing } = this,
            parent = canvas.parentNode as HTMLElement | null;
        // sizing
        if (parent && sizing) {
            const { width, height, computedStyle: { ratio } } = this,
                refBox = parent.getBoundingClientRect(),
                sizingResult = sizing(
                    width,
                    height,
                    refBox.width,
                    refBox.height,
                    this.margin
                );
            this._scale = sizingResult.scale;
            if (sizingResult) {
                const { style: canvasStyle } = canvas;
                this.width = width;
                this.height = height;
                canvas.width = sizingResult.width * ratio;
                canvas.height = sizingResult.height * ratio;
                canvasStyle.width = sizingResult.styleWidth + 'px';
                canvasStyle.height = sizingResult.styleHeight + 'px';
                canvasStyle.marginLeft = sizingResult.left + 'px';
                canvasStyle.marginTop = sizingResult.top + 'px';
            } else {
                canvas.width = width * ratio;
                canvas.height = height * ratio;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
            }
        }
        // update client coordinates
        const box = canvas.getBoundingClientRect();
        this._clientX = box.left;
        this._clientY = box.top;
    }

    protected _compute() {
        this._resize();
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
        if (this.interactive && !this._listenerAttached) {
            this.attachListeners();
        }
        this.childNodes.forEach(childNode => {
            childNode.compute();
        });
    }

    protected _render(context: CanvasRenderingContext2D) {
        context.drawImage(this.canvas, this.left, this.top, this.width, this.height);
    }

    compose() {
        const { context, computedStyle, width, height, left, top } = this;
        context.setTransform(computedStyle.ratio, 0, 0, computedStyle.ratio, 0, 0);
        if (computedStyle.fillStyle) {
            context.fillStyle = computedStyle.fillStyle;
            context.fillRect(0, 0, width, height);
        } else {
            context.clearRect(0, 0, width, height);
        }
        context.translate(-left, -top);
        Utils.renderNodes(this.childNodes, context);
    }

    private _emit(type: string, clientX: number, clientY: number, data: object) {
        const { _scale } = this,
            x = (clientX - this._clientX) / _scale,
            y = (clientY - this._clientY) / _scale,
            target = detectTarget(this.childNodes, x, y, true);
        if (target && target.interactive) {
            target.dispatchEvent(
                new Event(type, {
                    target,
                    cancelable: true,
                    bubbles: true,
                    data: Object.assign(data, { x, y })
                })
            );
        }
    }

    private _onMouseDown(event: MouseEvent) {
        if (this.interactive) {
            this._emit(
                'pointerdown',
                event.clientX,
                event.clientY,
                {
                    id: -1,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onMouseMove(event: MouseEvent) {
        if (this.interactive) {
            this._emit(
                'pointermove',
                event.clientX,
                event.clientY,
                {
                    id: -1,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onMouseUp(event: MouseEvent) {
        if (this.interactive) {
            this._emit(
                'pointerup',
                event.clientX,
                event.clientY,
                {
                    id: -1,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onTouchStart(event: TouchEvent) {
        if (this.interactive) {
            const touch = event.changedTouches[0];
            this._emit(
                'pointerdown',
                touch.clientX,
                touch.clientY,
                {
                    id: touch.identifier,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onTouchMove(event: TouchEvent) {
        if (this.interactive) {
            const touch = event.changedTouches[0];
            this._emit(
                'pointermove',
                touch.clientX,
                touch.clientY,
                {
                    id: touch.identifier,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onTouchEnd(event: TouchEvent) {
        if (this.interactive) {
            const touch = event.changedTouches[0];
            this._emit(
                'pointerup',
                touch.clientX,
                touch.clientY,
                {
                    id: touch.identifier,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onWheel(event: globalThis.WheelEvent) {
        if (this.interactive) {
            this._emit(
                'wheel',
                event.clientX,
                event.clientY,
                {
                    deltaX: event.deltaX,
                    deltaY: event.deltaY,
                    deltaZ: event.deltaZ,
                    deltaMode: event.deltaMode,
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    attachListeners() {
        if (this._listenerAttached) {
            return;
        }
        this._listenerAttached = true;
        const { canvas } = this;
        if (Utils.Const.IS_TOUCH_MODE) {
            canvas.addEventListener('touchstart', this._onTouchStart, Root.eventOptions);
            canvas.addEventListener('touchmove', this._onTouchMove, Root.eventOptions);
            canvas.addEventListener('touchend', this._onTouchEnd, Root.eventOptions);
        } else {
            canvas.addEventListener('mousedown', this._onMouseDown, Root.eventOptions);
            canvas.addEventListener('mousemove', this._onMouseMove, Root.eventOptions);
            canvas.addEventListener('mouseup', this._onMouseUp, Root.eventOptions);
            canvas.addEventListener('wheel', this._onWheel, Root.eventOptions);
        }
    }

    detachListeners() {
        if (!this._listenerAttached) {
            return;
        }
        this._listenerAttached = this.interactive = false;
        const { canvas } = this;
        if (Utils.Const.IS_TOUCH_MODE) {
            canvas.removeEventListener('touchstart', this._onTouchStart, Root.eventOptions);
            canvas.removeEventListener('touchmove', this._onTouchMove, Root.eventOptions);
            canvas.removeEventListener('touchend', this._onTouchEnd, Root.eventOptions);
        } else {
            canvas.removeEventListener('mousedown', this._onMouseDown, Root.eventOptions);
            canvas.removeEventListener('mousemove', this._onMouseMove, Root.eventOptions);
            canvas.removeEventListener('mouseup', this._onMouseUp, Root.eventOptions);
            canvas.removeEventListener('wheel', this._onWheel, Root.eventOptions);
        }
    }

}
