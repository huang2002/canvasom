import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions, CanvasPointerEvent, CanvasPointerEventData, CanvasWheelEventData } from './CanvasNode';
import { Renderer } from './Renderer';
import { Utils } from "../common/Utils";
import { detectTarget } from '../interaction/detectTarget';
import { Event } from '3h-event';

/**
 * The type of pointer.
 */
export type PointerType = 'mouse' | 'touch';
/** dts2md break */
/**
 * Type of options of {@link CanvasRoot}.
 */
export type CanvasRootOptions<EventType extends CanvasNodeEvent> = (
    & CanvasNodeOptions<EventType>
    & Partial<{
        /**
         * Renderer instance to use.
         * (If this is omitted, one will be created internally.)
         */
        renderer: Renderer;
        /**
         * Whether to always clear the canvas before rendering.
         * (The canvas will be automatically cleared
         * if `this.style.fillStyle === null`.)
         * @default false
         */
        forceClear: boolean;
        /**
         * The type of the pointer.
         * @default Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'touch' : 'mouse'
         */
        pointerType: PointerType;
        /**
         * Ignore pointer move events
         * that are not started on the canvas.
         * @default true
         */
        ignoreHover: boolean;
    }>
);
/** dts2md break */
/**
 * Class of canvas-object-model roots.
 */
export class CanvasRoot<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * The id used for mouses.
     */
    static mouseId = -1;
    /** dts2md break */
    /**
     * Constructor of {@link CanvasRoot}.
     */
    constructor(options?: CanvasRootOptions<EventType>) {

        super(options);

        this.isRoot = true;
        this.renderer = options?.renderer ?? new Renderer();
        this.forceClear = options?.forceClear ?? false;
        this.ignoreHover = options?.ignoreHover ?? true;
        this.pointerType = options?.pointerType
            ?? (Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'touch' : 'mouse');

        this.render = this.render.bind(this);
        this.updateAndRender = this.updateAndRender.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onWheel = this._onWheel.bind(this);

        this.attachListeners();

    }
    /** dts2md break */
    /**
     * The renderer instance in use.
     */
    renderer: Renderer;
    /** dts2md break */
    /**
     * Whether to always clear the canvas before rendering.
     * (The canvas will be automatically cleared
     * if `this.style.fillStyle === null`.)
     * @default false
     */
    forceClear: boolean;
    /** dts2md break */
    /**
     * Ignore pointer move events
     * that are not started on the canvas.
     * @default true
     */
    ignoreHover: boolean;
    /** dts2md break */
    /**
     * The type of the pointer.
     * @default Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'touch' : 'mouse'
     */
    readonly pointerType: PointerType;
    /** dts2md break */
    /**
     * pointerId -> startEvent
     */
    readonly pointerStart = new Map<number, CanvasPointerEvent | null>();
    /** dts2md break */
    /**
     * Returns `this.renderer.width`.
     */
    get width() {
        return this.renderer.width;
    }
    /** dts2md break */
    /**
     * Returns `this.renderer.height`.
     */
    get height() {
        return this.renderer.height;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.beforeUpdate
     */
    protected beforeUpdate() {
        const { bounds, renderer } = this;
        bounds.width = renderer.width;
        bounds.height = renderer.height;
    }
    /** dts2md break */
    /**
     * Render the child nodes using `this.renderer`.
     * (This method is bound to the instance automatically.)
     * @override CanvasNode.render
     */
    render() {
        const { renderer } = this;
        if (!this.style.fillStyle || this.forceClear) {
            renderer.context.clearRect(0, 0, renderer.width, renderer.height);
        }
        super.render(renderer);
    }
    /** dts2md break */
    /**
     * Invokes `this.update` & `this.render`.
     * (This method is bound to the instance automatically.)
     */
    updateAndRender() {
        this.update();
        this.render();
    }

    private _pointerStart(
        id: number,
        clientX: number,
        clientY: number,
        rawEvent: MouseEvent | TouchEvent,
    ) {

        const { renderer, pointerStart } = this;
        const x = renderer.toViewX(clientX);
        const y = renderer.toViewY(clientY);
        const targetPath = detectTarget(this as unknown as CanvasNode, x, y);

        if (!targetPath.length) {
            pointerStart.set(id, null);
            return;
        }

        const target = targetPath[targetPath.length - 1];
        const pointerStartEvent = new Event<'pointerstart', CanvasPointerEventData>({
            name: 'pointerstart',
            stoppable: true,
            cancelable: true,
            data: {
                id,
                x,
                y,
                target,
                rawEvent,
            },
        });

        pointerStart.set(id, pointerStartEvent);
        Utils.bubbleEvent(pointerStartEvent, targetPath);

    }

    private _pointerMove(
        id: number,
        clientX: number,
        clientY: number,
        rawEvent: MouseEvent | TouchEvent,
    ) {

        const { pointerStart } = this;
        if (this.ignoreHover && !pointerStart.has(id)) {
            return;
        }

        const { renderer } = this;
        const x = renderer.toViewX(clientX);
        const y = renderer.toViewY(clientY);
        const targetPath = detectTarget(this as unknown as CanvasNode, x, y);

        if (!targetPath.length) {
            return;
        }

        const target = targetPath[targetPath.length - 1];
        const pointerMoveEvent = new Event<'pointermove', CanvasPointerEventData>({
            name: 'pointermove',
            stoppable: true,
            cancelable: true,
            data: {
                id,
                x,
                y,
                target,
                rawEvent,
            },
        });

        Utils.bubbleEvent(pointerMoveEvent, targetPath);

    }

    private _pointerEnd(
        id: number,
        clientX: number,
        clientY: number,
        rawEvent: MouseEvent | TouchEvent,
    ) {

        const { renderer, pointerStart } = this;
        const x = renderer.toViewX(clientX);
        const y = renderer.toViewY(clientY);
        const targetPath = detectTarget(this as unknown as CanvasNode, x, y);

        if (!targetPath.length) {
            pointerStart.delete(id);
            return;
        }

        const target = targetPath[targetPath.length - 1];
        const pointerEndEvent = new Event<'pointerend', CanvasPointerEventData>({
            name: 'pointerend',
            stoppable: true,
            cancelable: true,
            data: {
                id,
                x,
                y,
                target,
                rawEvent,
            },
        });

        Utils.bubbleEvent(pointerEndEvent, targetPath);

        const pointerStartEvent = pointerStart.get(id);

        if (
            pointerStartEvent
            && (pointerStartEvent.data.target === target)
            && !pointerStartEvent.canceled
            && !pointerEndEvent.canceled
        ) {

            const clickEvent = new Event<'click', CanvasPointerEventData>({
                name: 'click',
                stoppable: true,
                cancelable: true,
                data: {
                    id,
                    x,
                    y,
                    target,
                    rawEvent,
                },
            });

            Utils.bubbleEvent(clickEvent, targetPath);

        }

        pointerStart.delete(id);

    }

    private _onMouseDown(rawEvent: MouseEvent) {
        if (!this.interactive || (rawEvent.target !== this.renderer.canvas)) {
            return;
        }
        rawEvent.preventDefault();
        this._pointerStart(
            CanvasRoot.mouseId,
            rawEvent.clientX,
            rawEvent.clientY,
            rawEvent,
        );
    }

    private _onMouseMove(rawEvent: MouseEvent) {
        if (!this.interactive) {
            return;
        }
        rawEvent.preventDefault();
        this._pointerMove(
            CanvasRoot.mouseId,
            rawEvent.clientX,
            rawEvent.clientY,
            rawEvent,
        );
    }

    private _onMouseUp(rawEvent: MouseEvent) {
        if (!this.interactive) {
            return;
        }
        rawEvent.preventDefault();
        this._pointerEnd(
            CanvasRoot.mouseId,
            rawEvent.clientX,
            rawEvent.clientY,
            rawEvent,
        );
    }

    private _onTouchStart(rawEvent: TouchEvent) {

        if (!this.interactive) {
            return;
        }

        rawEvent.preventDefault();

        const { changedTouches } = rawEvent;
        let touch;
        for (let i = 0; i < changedTouches.length; i++) {
            touch = changedTouches[i];
            this._pointerStart(
                touch.identifier,
                touch.clientX,
                touch.clientY,
                rawEvent,
            );
        }

    }

    private _onTouchMove(rawEvent: TouchEvent) {

        if (!this.interactive) {
            return;
        }

        rawEvent.preventDefault();

        const { changedTouches } = rawEvent;
        let touch;
        for (let i = 0; i < changedTouches.length; i++) {
            touch = changedTouches[i];
            this._pointerMove(
                touch.identifier,
                touch.clientX,
                touch.clientY,
                rawEvent,
            );
        }

    }

    private _onTouchEnd(rawEvent: TouchEvent) {

        if (!this.interactive) {
            return;
        }

        rawEvent.preventDefault();

        const { changedTouches } = rawEvent;
        let touch;
        for (let i = 0; i < changedTouches.length; i++) {
            touch = changedTouches[i];
            this._pointerEnd(
                touch.identifier,
                touch.clientX,
                touch.clientY,
                rawEvent,
            );
        }

    }

    private _onWheel(rawEvent: WheelEvent) {

        if (!this.interactive) {
            return;
        }

        rawEvent.preventDefault();

        const { renderer } = this;
        const x = renderer.toViewX(rawEvent.clientX);
        const y = renderer.toViewY(rawEvent.clientY);
        const targetPath = detectTarget(this as unknown as CanvasNode, x, y);

        if (!targetPath.length) {
            return;
        }

        const wheelEvent = new Event<'wheel', CanvasWheelEventData>({
            name: 'wheel',
            stoppable: true,
            cancelable: true,
            data: {
                id: CanvasRoot.mouseId,
                x,
                y,
                target: targetPath[targetPath.length - 1],
                deltaX: rawEvent.deltaX / renderer.ratio,
                deltaY: rawEvent.deltaY / renderer.ratio,
                deltaMode: rawEvent.deltaMode,
                rawEvent,
            },
        });

        Utils.bubbleEvent(wheelEvent, targetPath);

    }

    private _listenerAttached = false;
    /** dts2md break */
    /**
     * Attach event listeners to the canvas.
     * (invoked automatically during instance creation)
     */
    attachListeners() {

        if (this._listenerAttached) {
            return;
        }

        const { renderer: { canvas } } = this;

        switch (this.pointerType) {
            case 'mouse': {
                window.addEventListener('mousedown', this._onMouseDown, { passive: false });
                canvas.addEventListener('mousemove', this._onMouseMove, { passive: false });
                window.addEventListener('mouseup', this._onMouseUp, { passive: false });
                canvas.addEventListener('wheel', this._onWheel, { passive: false });
                break;
            }
            case 'touch': {
                window.addEventListener('touchstart', this._onTouchStart, { passive: false });
                canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
                window.addEventListener('touchend', this._onTouchEnd, { passive: false });
                break;
            }
            default: {
                throw new TypeError('unknown pointer type');
            }
        }

        this._listenerAttached = true;

    }
    /** dts2md break */
    /**
     * Detach event listeners to the canvas.
     */
    detachListeners() {

        if (!this._listenerAttached) {
            return;
        }

        const { renderer: { canvas } } = this;

        switch (this.pointerType) {
            case 'mouse': {
                window.removeEventListener('mousedown', this._onMouseDown);
                canvas.removeEventListener('mousemove', this._onMouseMove);
                window.removeEventListener('mouseup', this._onMouseUp);
                canvas.removeEventListener('wheel', this._onWheel);
                break;
            }
            case 'touch': {
                window.removeEventListener('touchstart', this._onTouchStart);
                canvas.removeEventListener('touchmove', this._onTouchMove);
                window.removeEventListener('touchend', this._onTouchEnd);
                break;
            }
            default: {
                throw new TypeError('unknown pointer type');
            }
        }

        this._listenerAttached = false;

    }

}
