import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions, CanvasPointerEvent, CanvasWheelEvent } from '../core/CanvasNode';
import { CanvasRoot } from "../core/CanvasRoot";
import { Utils } from "../common/Utils";
import { Schedule } from '../common/Schedule';
import { clamp } from '3h-utils';
import { Event } from '3h-event';
import { NodeRecordOptions } from '../utils/createFromRecord';

/**
 * Type of data of scroll event.
 */
export interface CanvasScrollEventData {
    /**
     * Scroll x. (clamped)
     */
    deltaX: number;
    /**
     * Scroll y. (clamped)
     */
    deltaY: number;
}
/** dts2md break */
/**
 * Type of scroll events on canvas nodes.
 */
export type CanvasScrollEvent = Event<'scroll', CanvasScrollEventData>;
/** dts2md break */
/**
 * Type map of events on scroll nodes.
 */
export interface ScrollNodeEvents extends CanvasNodeEvents {
    scroll: CanvasScrollEvent;
}
/** dts2md break */
/**
 * Type of interaction modes of scroll nodes.
 */
export type ScrollMode = 'drag' | 'wheel' | 'both';
/** dts2md break */
/**
 * Type of scroll direction.
 */
export type ScrollDirection = 'none' | 'x' | 'y' | 'both';
/** dts2md break */
/**
 * Type of options of {@link ScrollNode}.
 */
export type ScrollNodeOptions<Events extends ScrollNodeEvents> = (
    & CanvasNodeOptions<Events>
    & Partial<{
        /**
         * Scrollable width.
         * @default 0
         */
        scrollWidth: number;
        /**
         * Scrollable height.
         * @default 0
         */
        scrollHeight: number;
        /**
         * The interaction mode.
         * @default Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'drag' : 'wheel'
         */
        mode: ScrollMode;
        /**
         * Scrolling direction.
         * (This only restricts event-triggered scroll.)
         * @default 'none'
         */
        direction: ScrollDirection;
        /**
         * The node that holds event listeners.
         * @default options.root ?? this
         */
        eventRoot: CanvasNode<any>;
        /**
         * The node that should be updated on scrolling.
         * (Set this to null to disable automatic update.)
         * @default options.root
         */
        updateRoot: CanvasNode<any> | null;
        /**
         * The root node that should be rerendered on scrolling.
         * (Set this to null to disable automatic rerender.)
         * @default options.root
         */
        renderRoot: CanvasRoot<any> | null;
        /**
         * Default value of `eventRoot`, `updateRoot` and `renderRoot`.
         * @default null
         */
        root: CanvasRoot<any> | null;
        /**
         * Scroll scale of pixels.
         * @default 1
         */
        pixelScale: number;
        /**
         * Scroll scale of lines.
         * @default 25
         */
        lineScale: number;
        /**
         * Scroll scale of pages.
         * @default 300
         */
        pageScale: number;
        /**
         * The modifier used to shift
         * direction of wheel events.
         * @default 'Shift'
         */
        shiftModifier: string | null;
        /**
         * @override CanvasNodeOptions.interactive
         * @default true
         */
        interactive: boolean;
    }>
);
/** dts2md break */
/**
 * Class of container nodes that act like scrollable views.
 */
export class ScrollNode<Events extends ScrollNodeEvents = ScrollNodeEvents>
    extends CanvasNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link ScrollNode}.
     */
    constructor(options?: ScrollNodeOptions<Events>) {

        super(options);

        const defaultRoot = (options?.root !== undefined) ? options.root : null;

        this.mode = options?.mode
            ?? (Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'drag' : 'wheel');
        this.direction = options?.direction ?? 'none';
        this.eventRoot = options?.eventRoot ?? defaultRoot ?? this;
        this.updateRoot = options?.updateRoot ?? defaultRoot;
        this.renderRoot = options?.renderRoot ?? defaultRoot;
        this.scrollWidth = options?.scrollWidth ?? 0;
        this.scrollHeight = options?.scrollHeight ?? 0;
        this.pixelScale = options?.pixelScale ?? 1;
        this.lineScale = options?.lineScale ?? 25;
        this.pageScale = options?.pageScale ?? 300;
        this.shiftModifier = options?.shiftModifier ?? 'Shift';
        this.interactive = options?.interactive ?? true;

        this._onPointerStart = this._onPointerStart.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerEnd = this._onPointerEnd.bind(this);
        this._onWheel = this._onWheel.bind(this);

        this.attachListeners();

    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'scroll';
    /** dts2md break */
    /**
     * Scrollable width.
     * @default 0
     */
    scrollWidth: number;
    /** dts2md break */
    /**
     * Scrollable height.
     * @default 0
     */
    scrollHeight: number;
    /** dts2md break */
    /**
     * The interaction mode.
     * @default Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'drag' : 'wheel'
     */
    readonly mode: ScrollMode;
    /** dts2md break */
    /**
     * Scrolling direction.
     * (This only restricts event-triggered scroll.)
     * @default 'none'
     */
    direction: ScrollDirection;
    /** dts2md break */
    /**
     * The node that holds event listeners.
     * @default options.root ?? this
     */
    readonly eventRoot: CanvasNode<any>;
    /** dts2md break */
    /**
     * The root node that should be updated on scrolling.
     * (Set this to null to disable automatic update.)
     * @default options.root
     */
    updateRoot: CanvasNode<any> | null;
    /** dts2md break */
    /**
     * The root node that should be rerendered on scrolling.
     * (Set this to null to disable automatic rerender.)
     * @default options.root
     */
    renderRoot: CanvasRoot<any> | null;
    /** dts2md break */
    /**
     * Scroll scale of pixels.
     * @default 1
     */
    pixelScale: number;
    /** dts2md break */
    /**
     * Scroll scale of lines.
     * @default 25
     */
    lineScale: number;
    /** dts2md break */
    /**
     * Scroll scale of pages.
     * @default 300
     */
    pageScale: number;
    /** dts2md break */
    /**
     * The modifier used to shift
     * direction of wheel events.
     * @default 'Shift'
     */
    shiftModifier: string | null;
    /** dts2md break */
    /**
     * @override CanvasNode.interactive
     * @default true
     */
    interactive: boolean;

    private _scrollX = 0;
    private _scrollY = 0;
    /** dts2md break */
    /**
     * Get current scroll x.
     */
    get scrollX() {
        return this._scrollX;
    }
    /** dts2md break */
    /**
     * Get current scroll y.
     */
    get scrollY() {
        return this._scrollY;
    }
    /** dts2md break */
    /**
     * Scroll the view by specific amount.
     */
    scrollBy(dx: number, dy: number) {

        const { bounds } = this;
        const scrollX = clamp(
            this._scrollX + dx,
            0,
            this.scrollWidth - bounds.width,
        );
        const scrollY = clamp(
            this._scrollY + dy,
            0,
            this.scrollHeight - bounds.height,
        );
        const deltaX = scrollX - this._scrollX;
        const deltaY = scrollY - this._scrollY;

        const scrollEvent = new Event<'scroll', CanvasScrollEventData>({
            name: 'scroll',
            cancelable: true,
            stoppable: true,
            data: {
                deltaX,
                deltaY,
            },
        });

        this.emit(scrollEvent as unknown as Utils.ValueType<Events>);

        if (!scrollEvent.canceled) {

            this._scrollX = scrollX;
            this._scrollY = scrollY;

            if (deltaX || deltaY) {
                const { updateRoot, renderRoot } = this;
                if (updateRoot) {
                    Schedule.update(updateRoot);
                }
                if (renderRoot) {
                    Schedule.render(renderRoot);
                }
            }

        }

    }
    /** dts2md break */
    /**
     * Scroll the view to specific position.
     */
    scrollTo(x: number, y: number) {
        this.scrollBy(x - this._scrollX, y - this._scrollY);
    }
    /** dts2md break */
    /**
     * @override CanvasNode.updateLayout
     */
    protected updateLayout(timeStamp: number) {
        const layoutOffsetX = -this._scrollX;
        const layoutOffsetY = -this._scrollY;
        this.childNodes.forEach(childNode => {
            childNode.layoutOffsetX = layoutOffsetX;
            childNode.layoutOffsetY = layoutOffsetY;
        });
    }

    private _pointerId: number | null = null;
    private _x0 = 0;
    private _y0 = 0;
    private _scrollX0 = 0;
    private _scrollY0 = 0;

    private _onPointerStart(event: CanvasPointerEvent) {

        if ((this._pointerId !== null) || event.canceled) {
            return;
        }

        const { data } = event;

        this._pointerId = data.id;

        this._x0 = data.x;
        this._y0 = data.y;

        this._scrollX0 = this._scrollX;
        this._scrollY0 = this._scrollY;

    }

    private _onPointerMove(event: CanvasPointerEvent) {

        const { data } = event;

        if (this._pointerId !== data.id) {
            return;
        }

        const { x, y } = data;

        if (event.canceled) {
            this._x0 = x;
            this._y0 = y;
            this._scrollX0 = this._scrollX;
            this._scrollY0 = this._scrollY;
            return;
        }

        const { direction, _scrollX, _scrollY } = this;
        const allowScrollX = (direction === 'x') || (direction === 'both');
        const allowScrollY = (direction === 'y') || (direction === 'both');

        this.scrollTo(
            allowScrollX ? (this._scrollX0 + this._x0 - x) : 0,
            allowScrollY ? (this._scrollY0 + this._y0 - y) : 0,
        );

        if ((this._scrollX === _scrollX) && (this._scrollY === _scrollY)) { // not scrolled
            // reinitialize
            this._x0 = x;
            this._y0 = y;
            this._scrollX0 = this._scrollX;
            this._scrollY0 = this._scrollY;
        } else { // scrolled
            // prevent parent nodes from responding the event
            event.cancel();
        }

    }

    private _onPointerEnd(event: CanvasPointerEvent) {

        const { data } = event;

        if (this._pointerId !== data.id) {
            return;
        }

        if (!event.canceled) {
            const { direction } = this;
            const allowScrollX = (direction === 'x') || (direction === 'both');
            const allowScrollY = (direction === 'y') || (direction === 'both');
            this.scrollTo(
                allowScrollX ? (this._scrollX0 + this._x0 - data.x) : 0,
                allowScrollY ? (this._scrollY0 + this._y0 - data.y) : 0,
            );
        }

        this._pointerId = null;

    }

    private _onWheel(event: CanvasWheelEvent) {

        if ((this._pointerId !== null) || event.canceled) {
            return;
        }

        const { data } = event;
        let scale;

        switch (data.deltaMode) {
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
            default: {
                throw new TypeError('unknown delta mode');
            }
        }

        let { deltaX, deltaY } = data;

        const { shiftModifier } = this;
        if (shiftModifier && event.data.rawEvent.getModifierState(shiftModifier)) {
            // swap x and y
            deltaX ^= deltaY;
            deltaY ^= deltaX;
            deltaX ^= deltaY;
        }

        const { direction, _scrollX, _scrollY } = this;
        const allowScrollX = (direction === 'x') || (direction === 'both');
        const allowScrollY = (direction === 'y') || (direction === 'both');

        this.scrollBy(
            allowScrollX ? (deltaX * scale) : 0,
            allowScrollY ? (deltaY * scale) : 0,
        );

        if ((this._scrollX !== _scrollX) || (this._scrollY !== _scrollY)) { // scrolled
            // prevent parent nodes from responding the event
            event.cancel();
        }

    }

    private _listenerAttached = false;
    /** dts2md break */
    /**
     * Attach event listeners.
     */
    attachListeners() {

        if (this._listenerAttached) {
            return;
        }

        const { mode } = this;

        if ((mode === 'drag') || (mode === 'both')) {
            const { eventRoot } = this;
            this.addListener('pointerstart', this._onPointerStart);
            eventRoot.addListener('pointermove', this._onPointerMove);
            eventRoot.addListener('pointerend', this._onPointerEnd);
        }

        if ((mode === 'wheel') || (mode === 'both')) {
            this.addListener('wheel', this._onWheel);
        }

        this._listenerAttached = true;

    }
    /** dts2md break */
    /**
     * Detach event listeners.
     */
    detachListeners() {

        if (!this._listenerAttached) {
            return;
        }

        const { mode } = this;

        if ((mode === 'drag') || (mode === 'both')) {
            const { eventRoot } = this;
            this.removeListener('pointerstart', this._onPointerStart);
            eventRoot.removeListener('pointermove', this._onPointerMove);
            eventRoot.removeListener('pointerend', this._onPointerEnd);
        }

        if ((mode === 'wheel') || (mode === 'both')) {
            this.removeListener('wheel', this._onWheel);
        }

        this._listenerAttached = false;

    }
    /** dts2md break */
    /**
     * @override CanvasNode.getRecordOptions
     */
    getRecordOptions(): NodeRecordOptions {
        // TODO: implement serialization of scroll nodes
        throw new TypeError(
            "serialization of scroll nodes hasn't been implemented"
        );
    }

}

// TODO: implement serialization of scroll nodes
// registry.set('scroll', ScrollNode);
