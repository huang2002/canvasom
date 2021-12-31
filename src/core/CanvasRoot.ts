import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions } from './CanvasNode';
import { Renderer } from './Renderer';
import { Utils } from "../common/Utils";

/**
 * The type of pointer.
 */
export type PointerType = 'mouse' | 'touch';
/** dts2md break */
/**
 * Type of `CanvasRoot` options.
 */
export type CanvasRootOptions = CanvasNodeOptions & Partial<{
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
}>;
/** dts2md break */
/**
 * Class of canvas-object-model roots.
 */
export class CanvasRoot<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * Constructor of `CanvasRoot`.
     */
    constructor(options?: CanvasRootOptions) {

        super(options);

        this.isRoot = true;
        this.renderer = options?.renderer ?? new Renderer();
        this.forceClear = options?.forceClear ?? false;
        this.pointerType = options?.pointerType
            ?? (Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'touch' : 'mouse');

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
     * The type of the pointer.
     * @default Utils.Constants.SUPPORTS_TOUCH_EVENTS ? 'touch' : 'mouse'
     */
    readonly pointerType: PointerType;
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
     * @override CanvasNode.update
     */
    protected beforeUpdate() {
        const { bounds, renderer } = this;
        bounds.width = renderer.width;
        bounds.height = renderer.height;
    }
    /** dts2md break */
    /**
     * Render the child nodes using `this.renderer`.
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
     */
    updateAndRender() {
        this.update();
        this.render();
    }

    private _pointerStart(id: number, clientX: number, clientY: number) {

    }

    private _pointerMove(id: number, clientX: number, clientY: number) {

    }

    private _pointerEnd(id: number, clientX: number, clientY: number) {

    }

    private _onMouseDown(event: MouseEvent) {
        if (!this.interactive) {
            return;
        }
        event.preventDefault();
        this._pointerStart(-1, event.clientX, event.clientY);
    }

    private _onMouseMove(event: MouseEvent) {
        if (!this.interactive) {
            return;
        }
        event.preventDefault();
        this._pointerMove(-1, event.clientX, event.clientY);
    }

    private _onMouseUp(event: MouseEvent) {
        if (!this.interactive) {
            return;
        }
        event.preventDefault();
        this._pointerEnd(-1, event.clientX, event.clientY);
    }

    private _onTouchStart(event: TouchEvent) {

        if (!this.interactive) {
            return;
        }

        event.preventDefault();

        const { changedTouches } = event;
        let touch;
        for (let i = 0; i < changedTouches.length; i++) {
            touch = changedTouches[i];
            this._pointerStart(touch.identifier, touch.clientX, touch.clientY);
        }

    }

    private _onTouchMove(event: TouchEvent) {

        if (!this.interactive) {
            return;
        }

        event.preventDefault();

        const { changedTouches } = event;
        let touch;
        for (let i = 0; i < changedTouches.length; i++) {
            touch = changedTouches[i];
            this._pointerMove(touch.identifier, touch.clientX, touch.clientY);
        }

    }

    private _onTouchEnd(event: TouchEvent) {

        if (!this.interactive) {
            return;
        }

        event.preventDefault();

        const { changedTouches } = event;
        let touch;
        for (let i = 0; i < changedTouches.length; i++) {
            touch = changedTouches[i];
            this._pointerEnd(touch.identifier, touch.clientX, touch.clientY);
        }

    }

    private _onWheel(event: WheelEvent) {

        if (!this.interactive) {
            return;
        }

        event.preventDefault();

        // TODO:

    }

    private _listenerAttached = false;
    /** dts2md break */
    /**
     * Attach event listeners to the canvas.
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
