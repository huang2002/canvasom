import { Event } from './Event';
import { Node } from '../nodes/Node';
import { PointerEvent, PointerEventData } from '../nodes/Root';
import { EventTarget, EventTargetOptions } from './EventTarget';

/**
 * Emits on Draggable instances when dragging states change
 * (event type: 'dragStart' | 'drag' | 'dragEnd';
 * the data equal those of original pointer events;
 * 'dragStart' and 'drag' events are cancelable)
 */
export type DragEvent = Event<PointerEventData>;
/** dts2md break */
export type DraggableOptions = EventTargetOptions & Partial<{
    active: boolean;
    target: Node | null;
    control: Node | null;
    root: Node | null;
}>;
/** dts2md break */
export class Draggable extends EventTarget implements Required<DraggableOptions> {
    /** dts2md break */
    static defaults: DraggableOptions = {
        active: true,
        target: null,
        control: null,
        root: null,
    };
    /** dts2md break */
    constructor(options?: Readonly<DraggableOptions>) {
        super();
        Object.assign(this, Draggable.defaults, options);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        let { control } = this;
        if (!control && this.target) {
            control = this.target;
            (this.control as Node | null) = control;
        }
        if (control) {
            this._attach(control, this.root);
        }
    }

    /** dts2md break */
    /**
     * The control node to which `pointerdown` listeners are attached
     * @default target
     */
    readonly control!: Node | null;
    /** dts2md break */
    /**
     * The root node to which `pointermove`
     * and `pointerup` listeners are attached
     * @default control
     */
    readonly root!: Node | null;
    /** dts2md break */
    /**
     * The target node to which dragging applies
     * @default null
     */
    target!: Node | null;
    /** dts2md break */
    /**
     * Whether dragging is currently allowed
     * @default true
     */
    active!: boolean;
    /** dts2md break */
    /**
     * Whether dragging is happening
     */
    isDragging = false;
    /** dts2md break */
    /**
     * The offset of the dragging point
     * from the control node
     */
    offsetX = 0;
    offsetY = 0;

    /** dts2md break */
    /**
     * Internal listeners
     */

    onPointerDown(event: PointerEvent) {
        const { target } = this;
        if (!target) {
            this.isDragging = false;
            return;
        }
        this.offsetX = event.data.x - target.x;
        this.offsetY = event.data.y - target.y;
        this.isDragging = true;
        const dragEvent = new Event<PointerEventData>('dragStart', {
            data: event.data,
            cancelable: true
        });
        if (this.dispatchEvent(dragEvent)) { // default prevented
            this.isDragging = false;
            return;
        }
    }

    onPointerMove(event: PointerEvent) {
        if (!this.isDragging) {
            return;
        }
        const { target } = this;
        if (!target) {
            this.isDragging = false;
            return;
        }
        const dragEvent = new Event<PointerEventData>('drag', {
            data: event.data,
            cancelable: true
        });
        if (!this.dispatchEvent(dragEvent)) { // not default prevented
            target.update({
                x: event.data.x - this.offsetX,
                y: event.data.y - this.offsetY
            });
        }
    }

    onPointerUp(event: PointerEvent) {
        this.isDragging = false;
        this.dispatchEvent(
            new Event<PointerEventData>('dragEnd', {
                data: event.data
            })
        );
    }

    private _attach(control: Node, root: Node | null) {
        let _root = root;
        if (_root === null) {
            _root = control;
            (this.root as Node | null) = _root;
        }
        control.addListener('pointerdown', this.onPointerDown);
        _root.addListener('pointermove', this.onPointerMove);
        _root.addListener('pointerup', this.onPointerUp);
    }

    private _detach() {
        this.control!.removeListener('pointerdown', this.onPointerDown);
        this.root!.removeListener('pointermove', this.onPointerMove);
        this.root!.removeListener('pointerup', this.onPointerUp);
    }

    /** dts2md break */
    /**
     * Set the dragging control
     */
    reset(control: Node | null, root: Node | null) {
        if (this.control) {
            this._detach();
        }
        (this.control as Node | null) = control;
        (this.root as Node | null) = root;
        if (control) {
            this._attach(control, root);
        }
    }

}
