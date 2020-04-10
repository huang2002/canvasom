import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';
import { WheelEvent, PointerEvent } from '../nodes/Root';
import { Event } from '../events/Event';

export interface ScrollEventData {
    deltaX: number;
    deltaY: number;
}
/** dts2md break */
/**
 * The mode that tells how to interact with the scroll view
 * - 'wheel' - using `wheel` events
 * - 'drag' - using pointer events
 * - 'both' - both `wheel` events and pointer events
 * @default 'both'
 */
export type ScrollMode = 'wheel' | 'drag' | 'both';
/** dts2md break */
/**
 * Emits on the scroll view that is scrolling
 * (event type: 'scroll')
 */
export type ScrollEvent = Event<ScrollEventData>;
/** dts2md break */
export interface ScrollOptions extends NodeOptions {
    horizontal?: boolean;
    vertical?: boolean;
    width: number;
    height: number;
    offsetWidth?: number;
    offsetHeight?: number;
    mode?: ScrollMode;
    pixelScale?: number;
    lineScale?: number;
    pageScale?: number;
}
/** dts2md break */
/**
 * The class of scroll view containers
 */
export class Scroll extends Node implements Required<ScrollOptions> {

    /** dts2md break */
    static defaults: Partial<ScrollOptions> = {
        interactive: true,
        horizontal: false,
        vertical: false,
        offsetWidth: 0,
        offsetHeight: 0,
        mode: 'both',
        pixelScale: 1,
        lineScale: 25,
        pageScale: 300,
    };

    /** dts2md break */
    constructor(options: Readonly<ScrollOptions>) {
        super();
        Object.assign(this, Scroll.defaults, options);
        this.addListener('pointerdown', this._onPointerDown.bind(this));
        this.addListener('pointermove', this._onPointerMove.bind(this));
        this.addListener('pointerup', this._onPointerUp.bind(this));
        this.addListener('wheel', this._onWheel.bind(this));
    }

    /** dts2md break */
    readonly tag = 'scroll';
    /** dts2md break */
    /**
     * Current scrolling offset
     */
    readonly offsetX: number = 0;
    readonly offsetY: number = 0;
    /** dts2md break */
    /**
     * Whether the view can scroll horizontally/vertically
     * @default false (both)
     */
    horizontal!: boolean;
    vertical!: boolean;
    /** dts2md break */
    /**
     * The view size
     * (this affects the scrolling boundary)
     */
    width!: number;
    height!: number;
    /** dts2md break */
    /**
     * The content size
     * (also affects the scrolling boundary)
     */
    offsetWidth!: number;
    offsetHeight!: number;
    /** dts2md break */
    /**
     * The scroll mode (see type definition above)
     */
    mode!: ScrollMode;
    /** dts2md break */
    /**
     * The scrolling scale of different scrolling modes
     * (applied according to `event.deltaMode`)
     */
    pixelScale!: number;
    lineScale!: number;
    pageScale!: number;
    /** dts2md break */
    protected _flexible = true;
    private _isDragging = false;
    private _lastX = 0;
    private _lastY = 0;

    /** dts2md break */
    protected _compute() {
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
        this.left -= this.offsetX;
        this.top -= this.offsetY;
    }

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    /** dts2md break */
    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

    /** dts2md break */
    scrollBy(deltaX: number, deltaY: number) {
        const { offsetX: ox, offsetY: oy, offsetWidth, offsetHeight } = this,
            offsetX = offsetWidth && Utils.clamp(ox + deltaX, 0, offsetWidth - this.width),
            offsetY = offsetHeight && Utils.clamp(oy + deltaY, 0, offsetHeight - this.height),
            dx = offsetX - ox,
            dy = offsetY - oy;
        this.update({ offsetX, offsetY });
        this.dispatchEvent(
            new Event<ScrollEventData>('scroll', {
                cancelable: true,
                target: this,
                data: {
                    deltaX: dx,
                    deltaY: dy
                }
            })
        );
    }

    scrollTo(x: number, y: number) {
        this.scrollBy(x - this.offsetX, y - this.offsetY);
    }

    private _onWheel(event: WheelEvent) {
        if (event.defaultPrevented || this.mode === 'drag') {
            return;
        }
        const { deltaX, deltaY } = event.data;
        let scale = 1;
        switch (event.data.deltaMode) {
            case 0: {
                scale = this.pixelScale;
                break;
            }
            case 1: {
                scale = this.lineScale;
                break;
            }
            case 2: {
                scale = this.pageScale;
                break;
            }
        }
        this.scrollBy(
            this.horizontal ? deltaX * scale : 0,
            this.vertical ? deltaY * scale : 0
        );
    }

    private _onPointerDown(event: PointerEvent) {
        if (!event.defaultPrevented || this.mode === 'wheel') {
            this._isDragging = true;
            this._lastX = event.data.x;
            this._lastY = event.data.y;
        }
    }

    private _onPointerMove(event: PointerEvent) {
        if (this._isDragging && !event.defaultPrevented) {
            const { x, y } = event.data;
            this.scrollBy(
                this.horizontal ? this._lastX - x : 0,
                this.vertical ? this._lastY - y : 0
            );
            this._lastX = x;
            this._lastY = y;
        }
    }

    private _onPointerUp() {
        this._isDragging = false;
    }

}
