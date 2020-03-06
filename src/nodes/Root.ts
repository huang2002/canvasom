import { NodeOptions, Node } from './Node';
import { Utils } from '../common/Utils';
import { Event } from '../events/Event';
import { detectTarget } from './detectTarget';
import { SizingStrategy, Sizing } from './Sizing';
import { Schedule } from '../common/Schedule';

export interface PointerEventData {
    /**
     * The pointer id
     * (native touch identifier for touch-caused events
     * and `event.button` for mouse-caused events)
     */
    id: number;
    /**
     * The position where this event happened
     * (in canvas coordinates where the node is)
     */
    x: number;
    y: number;
    /**
     * The timestamp when the event happened
     * (equals the `timeStamp` property of corresponding native event)
     */
    timeStamp: number;
}
/** dts2md break */
/**
 * Pointer events are emitted on nodes which are supposed to
 * interact with the pointer(mouse/touch), like those in DOM.
 * (You must set `interactive` properties to true on a node and
 * all its parent nodes to let it receive related pointer events)
 *
 * Currently supported types of pointer events:
 * - pointerdown
 * - pointermove
 * - pointerup
 * - wheel
 * - click
 *
 * @example
 * ```js
 * node.addListener('pointerdown', event => {
 *     console.log('pointerdown', event);
 * });
 * ```
 */
export type PointerEvent = Event<PointerEventData>;
/** dts2md break */
export interface WheelEventData extends PointerEventData {
    /**
     * All these properties are equal to their
     * counterparts on corresponding native event
     */
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    deltaMode: number;
}
/** dts2md break */
/**
 * A wrapper for native wheel events
 */
export type WheelEvent = Event<WheelEventData>;
/** dts2md break */
export type RootOptions = NodeOptions & Partial<{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    sizing: SizingStrategy | null;
    sizingDelay: number;
    margin: number;
}>;
/** dts2md break */
export class Root extends Node implements Required<RootOptions> {

    /** dts2md break */
    static defaults: RootOptions = {
        sizing: Sizing.Contain,
        sizingDelay: 200,
        margin: 0
    };

    /** dts2md break */
    /**
     * The options used when invoking `element.addEventListener`
     * @defaults { passive: true }
     */
    static eventOptions: AddEventListenerOptions = {
        passive: true,
    };

    /** dts2md break */
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
                if (
                    !init.defaultPrevented
                    && event.target === init.target
                ) {
                    Schedule.nextTick(() => {
                        if (!event.defaultPrevented) {
                            event.target!.dispatchEvent(new Event('click', event));
                        }
                    });
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

    /** dts2md break */
    readonly tag = 'root';
    /** dts2md break */
    /**
     * The canvas and its context used by the root when composing
     * (The canvas can be passed as an option, and the context
     * will be automatically created in the constructor; You must
     * append the canvas to your document in order to display it
     * if it is not contained in the document)
     */
    readonly canvas!: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    /** dts2md break */
    /**
     * The sizing delay passed to `Utils.debounce` when the resize
     * listener is created and attached.
     */
    readonly sizingDelay!: number;
    /** dts2md break */
    /**
     * The resize listener used internally
     */
    readonly resize: () => void;
    /** dts2md break */
    /**
     * A `pointerdown` event record (id -> event)
     * (after a `pointerup` event happens, its
     * corresponding `pointerdown` event will be deleted)
     */
    readonly pointerInit = new Map<number, PointerEvent>();
    /** dts2md break */
    /**
     * The design size of the canvas
     * (used by sizing strategy and may be adjusted by it)
     */
    width!: number;
    height!: number;
    /** dts2md break */
    /**
     * The sizing strategy used to instruct the resizing
     * (the sizing is based on the bounding client rect
     * of the parent node of the canvas; sizing will be
     * skipped if the canvas have no parent node)
     */
    sizing!: SizingStrategy | null;
    /** dts2md break */
    /**
     * The margin of the canvas (used by sizing strategy)
     */
    margin!: number;
    private _scale = 1;
    private _listenerAttached = false;
    private _clientX = 0;
    private _clientY = 0;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    private _resize() {
        const { canvas, sizing } = this,
            parent = canvas.parentNode as HTMLElement | null;
        /* sizing */
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
        /* update client coordinates */
        const box = canvas.getBoundingClientRect();
        this._clientX = box.left;
        this._clientY = box.top;
    }

    /** dts2md break */
    protected _compute() {
        this._resize();
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
        if (this.interactive && !this._listenerAttached) {
            this.attachListeners();
        }
    }

    protected _render(context: CanvasRenderingContext2D) {
        context.drawImage(this.canvas, this.left, this.top, this.width, this.height);
    }

    /** dts2md break */
    /**
     * Compose the content of the root synchronously
     * (this method will be invoked asynchronously and
     * automatically whenever the child nodes changed;
     * if you have to compose the content synchronously,
     * remember to invoke `compute` first to update the
     * node states synchronously and unmark this root
     * using `Schedule.unmark` to avoid extra compution)
     */
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
                    id: event.button,
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
                    id: event.button,
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
                    id: event.button,
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

    /** dts2md break */
    /**
     * Attach/Detach pointer event listeners synchronously
     * (the listeners will be automatically attached when
     * the `interactive` property is set to true, but they
     * won't be automatically detached; when you detach
     * the listeners, `interactive` will be set to false)
     */
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
