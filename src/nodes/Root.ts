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
    penetrable = true;
    width!: number;
    height!: number;
    sizing!: SizingStrategy | null;
    margin!: number;
    private _scale = 1;
    private _listenerAttached = false;
    private _clientX = 0;
    private _clientY = 0;

    readonly resize: () => void;

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

    private _emit(type: string, clientX: number, clientY: number, timeStamp: number) {
        const { _scale } = this,
            x = (clientX - this._clientX) / _scale,
            y = (clientY - this._clientY) / _scale,
            target = detectTarget(this.childNodes, x, y, true);
        if (target && target.interactive) {
            target.dispatchEvent(
                new Event<PointerEventData>(type, {
                    target,
                    cancelable: true,
                    bubbles: true,
                    data: { x, y, timeStamp }
                })
            );
        }
    }

    private _onMouseDown(event: MouseEvent) {
        if (this.interactive) {
            this._emit('pointerdown', event.clientX, event.clientY, event.timeStamp);
        }
    }

    private _onMouseMove(event: MouseEvent) {
        if (this.interactive) {
            this._emit('pointermove', event.clientX, event.clientY, event.timeStamp);
        }
    }

    private _onMouseUp(event: MouseEvent) {
        if (this.interactive) {
            this._emit('pointerup', event.clientX, event.clientY, event.timeStamp);
        }
    }

    private _onTouchStart(event: TouchEvent) {
        if (this.interactive) {
            this._emit(
                'pointerdown',
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                event.timeStamp
            );
        }
    }

    private _onTouchMove(event: TouchEvent) {
        if (this.interactive) {
            this._emit(
                'pointermove',
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                event.timeStamp
            );
        }
    }

    private _onTouchEnd(event: TouchEvent) {
        if (this.interactive) {
            this._emit(
                'pointerup',
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                event.timeStamp
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
            canvas.addEventListener('touchstart', this._onTouchStart);
            canvas.addEventListener('touchmove', this._onTouchMove);
            canvas.addEventListener('touchend', this._onTouchEnd);
        } else {
            canvas.addEventListener('mousedown', this._onMouseDown);
            canvas.addEventListener('mousemove', this._onMouseMove);
            canvas.addEventListener('mouseup', this._onMouseUp);
        }
    }

    detachListeners() {
        if (!this._listenerAttached) {
            return;
        }
        this._listenerAttached = false;
        const { canvas } = this;
        if (Utils.Const.IS_TOUCH_MODE) {
            canvas.removeEventListener('touchstart', this._onTouchStart);
            canvas.removeEventListener('touchmove', this._onTouchMove);
            canvas.removeEventListener('touchend', this._onTouchEnd);
        } else {
            canvas.removeEventListener('mousedown', this._onMouseDown);
            canvas.removeEventListener('mousemove', this._onMouseMove);
            canvas.removeEventListener('mouseup', this._onMouseUp);
        }
    }

}
