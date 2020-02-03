import { NodeOptions, Node } from './Node';
import { Utils } from '../common/Utils';
import { Event } from '../events/Event';
import { detectTarget } from './detectTarget';
import { SizingStrategy, Sizing } from './Sizing';
import { Schedule } from '../common/Schedule';

export interface PointerEventData {
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
        width: 300,
        height: 150,
        sizing: Sizing.Contain,
        sizingDelay: 200,
        margin: 0
    };

    static eventOptions: AddEventListenerOptions = {
        passive: true
    };

    constructor(options?: Readonly<RootOptions>) {
        super();
        Object.assign(this, Root.defaults, options);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
        }
        this.context = this.canvas.getContext('2d')!;
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onWheel = this._onWheel.bind(this);
        if (this.interactive) {
            this.attachListeners();
        }
        this.resize = Utils.debounce(
            function resize(this: Root) {
                if (this.canvas.parentNode) {
                    this._resize();
                    Schedule.mark(this);
                }
            },
            this.sizingDelay,
            this
        );
        window.addEventListener('resize', this.resize);
    }

    readonly canvas!: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly sizingDelay!: number;
    readonly resize: () => void;
    width!: number;
    height!: number;
    sizing!: SizingStrategy | null;
    margin!: number;
    protected _fixedBounds = true;
    private _scale = 1;
    private _listenerAttached = false;
    private _clientX = 0;
    private _clientY = 0;

    protected _containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    private _resize() {
        const { canvas, context, sizing, computedStyle, width, height } = this,
            { style: canvasStyle } = canvas,
            { ratio } = computedStyle,
            parent = canvas.parentNode as HTMLElement | null;
        // resize canvas
        if (!parent || !sizing) {
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        } else {
            const refBox = parent.getBoundingClientRect(),
                sizingResult = sizing(width, height, refBox.width, refBox.height, this.margin);
            this._scale = sizingResult.scale;
            canvas.width = sizingResult.width * ratio;
            canvas.height = sizingResult.height * ratio;
            canvasStyle.width = sizingResult.styleWidth + 'px';
            canvasStyle.height = sizingResult.styleHeight + 'px';
            canvasStyle.marginLeft = sizingResult.left + 'px';
            canvasStyle.marginTop = sizingResult.top + 'px';
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        // update client coordinates
        const box = canvas.getBoundingClientRect();
        this._clientX = box.left;
        this._clientY = box.top;
    }

    protected _compute() {
        this._resize();
        this.bounds.setSize(this.width, this.height);
        if (this.interactive && !this._listenerAttached) {
            this.attachListeners();
        }
    }

    protected _render(context: CanvasRenderingContext2D) {
        context.drawImage(this.canvas, 0, 0);
    }

    compose() {
        const { context, computedStyle, width, height } = this;
        if (computedStyle.fillStyle) {
            context.fillStyle = computedStyle.fillStyle;
            context.fillRect(0, 0, width, height);
        } else {
            context.clearRect(0, 0, width, height);
        }
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
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onTouchStart(event: TouchEvent) {
        if (this.interactive) {
            this._emit(
                'pointerdown',
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                {
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onTouchMove(event: TouchEvent) {
        if (this.interactive) {
            this._emit(
                'pointermove',
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                {
                    timeStamp: event.timeStamp
                }
            );
        }
    }

    private _onTouchEnd(event: TouchEvent) {
        if (this.interactive) {
            this._emit(
                'pointerup',
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                {
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
        this._listenerAttached = false;
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
