import { type Event, EventEmitter } from "3h-event";
import { insertElement, removeElements } from "3h-utils";
import { CanvasStyle, Style } from '../common/Style';
import type { Renderer } from './Renderer';
import { Bounds } from '../common/Bounds';
import { Utils } from "../common/Utils";
import { Schedule } from '../common/Schedule';

/**
 * Type of data of pinter events on canvas nodes.
 */
export interface CanvasPointerEventData {
    /**
     * Pointer id.
     */
    id: number;
    /**
     * The x-offset of the pointer in current view.
     */
    x: number;
    /**
     * The y-offset of the pointer in current view.
     */
    y: number;
    /**
     * The interaction target.
     */
    target: CanvasNode;
    /**
     * The original DOM event.
     */
    rawEvent: MouseEvent | TouchEvent;
}
/** dts2md break */
/**
 * Emits when pointer interactions start.
 */
export type CanvasPointerStartEvent = Event<'pointerstart', CanvasPointerEventData>;
/** dts2md break */
/**
 * Emits when pointers move.
 */
export type CanvasPointerMoveEvent = Event<'pointermove', CanvasPointerEventData>;
/** dts2md break */
/**
 * Emits when pointer interactions end.
 */
export type CanvasPointerEndEvent = Event<'pointerend', CanvasPointerEventData>;
/** dts2md break */
/**
 * Emits when a click interaction is detected.
 */
export type CanvasClickEvent = Event<'click', CanvasPointerEventData>;
/** dts2md break */
/**
 * Type of pointer events on canvas nodes.
 */
export type CanvasPointerEvent = (
    | CanvasPointerStartEvent
    | CanvasPointerMoveEvent
    | CanvasPointerEndEvent
    | CanvasClickEvent
);
/** dts2md break */
/**
 * Type of data of wheel events on canvas nodes.
 */
export type CanvasWheelEventData = CanvasPointerEventData & {
    /**
     * Delta x in canvas view.
     */
    deltaX: number;
    /**
     * Delta y in canvas view.
     */
    deltaY: number;
    /**
     * Delta mode derived from original DOM event.
     */
    deltaMode: number;
    /**
     * The original DOM event.
     */
    rawEvent: WheelEvent;
};
/** dts2md break */
/**
 * Type of wheel events on canvas nodes.
 */
export type CanvasWheelEvent = Event<'wheel', CanvasWheelEventData>;
/** dts2md break */
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
 * Type map of events on canvas nodes.
 */
export type CanvasNodeEvents = {
    pointerstart: CanvasPointerStartEvent;
    pointermove: CanvasPointerMoveEvent;
    pointerend: CanvasPointerEndEvent;
    click: CanvasClickEvent;
    wheel: CanvasWheelEvent;
    scroll: CanvasScrollEvent;
};
/** dts2md break */
/**
 * Type of position parameters of canvas nodes.
 * 'relative' - Relative to the parent node.
 * 'absolute' - Relative to the root node.
 */
export type CanvasNodePosition = 'relative' | 'absolute';
/** dts2md break */
/**
 * Type of options of {@link CanvasNode}.
 */
export type CanvasNodeOptions<Events extends CanvasNodeEvents> = Partial<{
    /**
     * The x-offset of this node.
     * @default 0
     */
    offsetX: number;
    /**
     * The y-offset of this node.
     * @default 0
     */
    offsetY: number;
    /**
     * Set `bounds.width`.
     */
    boundsWidth: number;
    /**
     * Set `bounds.height`.
     */
    boundsHeight: number;
    /**
     * The positioning mode of this node.
     * @default 'relative'
     */
    position: CanvasNodePosition;
    /**
     * Whether the node should be rendered.
     * @default true
     */
    visible: boolean;
    /**
     * Whether the node is interactive.
     * @default false
     */
    interactive: boolean;
    /**
     * Whether to skip to child nodes directly
     * when detecting interaction target.
     * @default false
     */
    penetrable: boolean;
    /**
     * The style of the node.
     * @default {}
     */
    style: Partial<CanvasStyle>;
    /**
     * Whether the node should be updated.
     * @default false
     */
    noUpdate: boolean;
    /**
     * Set a few event listeners.
     * (eventName -> listener | listenerRecord)
     * @example
     * ```js
     * COM.create(COM.Rect, {
     *     // ...
     *     listeners: {
     *         click: clickListener, // listener
     *         pointerstart: { // listenerRecord
     *             listener: pointerStartListener,
     *             once: true,
     *         },
     *     },
     * });
     * ```
     */
    listeners: Partial<Utils.EventListeners<Events>>;
}>;
/**
 * Class of canvas object nodes.
 * (This is the base class of all other nodes;
 * you can also use this type of node
 * as pure containers to group other nodes.)
 */
export class CanvasNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends EventEmitter<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link CanvasNode}.
     */
    constructor(options?: CanvasNodeOptions<Events>) {

        super();

        this.offsetX = options?.offsetX ?? 0;
        this.offsetY = options?.offsetY ?? 0;
        this.position = options?.position ?? 'relative';
        this.visible = options?.visible ?? true;
        this.interactive = options?.interactive ?? false;
        this.penetrable = options?.penetrable ?? false;
        this.style = options?.style ?? (Object.create(null) as {});
        this.noUpdate = options?.noUpdate ?? false;

        if (options?.listeners) {
            this.setListeners(options.listeners);
        }

        if (options?.boundsWidth) {
            this.bounds.width = options.boundsWidth;
        }
        if (options?.boundsHeight) {
            this.bounds.height = options.boundsHeight;
        }

    }
    /** dts2md break */
    /**
     * The bounds of this node.
     */
    readonly bounds = new Bounds();
    /** dts2md break */
    /**
     * The x-offset of this node.
     * @default 0
     */
    offsetX: number;
    /** dts2md break */
    /**
     * The y-offset of this node.
     * @default 0
     */
    offsetY: number;
    /** dts2md break */
    /**
     * The positioning mode of this node.
     * @default 'relative'
     */
    position: CanvasNodePosition;
    /** dts2md break */
    /**
     * Whether the node should be rendered.
     * @default true
     */
    visible: boolean;
    /**
     * Whether the node is interactive.
     * @default false
     */
    interactive: boolean;
    /** dts2md break */
    /**
     * Whether to skip to child nodes directly
     * when detecting interaction target.
     * @default false
     */
    penetrable: boolean;
    /** dts2md break */
    /**
     * The style of the node.
     * @default {}
     */
    style: Partial<CanvasStyle>;
    /** dts2md break */
    /**
     * Whether the node should be updated.
     * @default false
     */
    noUpdate: boolean;
    /** dts2md break */
    /**
     * Whether this is a root node.
     * (Root nodes can not have parent nodes.)
     */
    protected isRoot = false;
    /** dts2md break */
    /**
     * Whether the child nodes should be updated automatically.
     * @default false
     */
    protected noChildUpdate = false;
    /** dts2md break */
    /**
     * Whether the child nodes should be rendered automatically.
     * @default false
     */
    protected noChildRender = false;
    /** dts2md break */
    /**
     * The x offset in layout.
     * (This should be set by layout parent nodes.)
     * @default 0
     */
    protected layoutOffsetX = 0;
    /** dts2md break */
    /**
     * The y offset in layout.
     * (This should be set by layout parent nodes.)
     * @default 0
     */
    protected layoutOffsetY = 0;

    private _parentNode: CanvasNode<Events> | null = null;
    private _childNodes: CanvasNode<Events>[] = [];
    private _x = 0;
    private _y = 0;
    private _computedStyle: CanvasStyle = Object.assign(
        Object.create(null),
        Style.defaults,
    );
    /** dts2md break */
    /**
     * A reference to the parent node.
     */
    get parentNode() {
        return this._parentNode;
    }
    /** dts2md break */
    /**
     * An array that contains the child nodes.
     */
    get childNodes(): readonly CanvasNode<Events>[] {
        return this._childNodes;
    }
    /** dts2md break */
    /**
     * The absolute x-offset of this node.
     */
    get x() {
        return this._x;
    }
    /** dts2md break */
    /**
     * The absolute y-offset of this node.
     */
    get y() {
        return this._y;
    }
    /** dts2md break */
    /**
     * Get computed style properties.
     * (This is automatically computed when updating,
     * from `this.style` and `parentNode.computedStyle`.)
     */
    get computedStyle() {
        return this._computedStyle;
    }
    /** dts2md break */
    /**
     * @see CanvasNodeOptions.listeners
     */
    setListeners(listeners: Partial<Utils.EventListeners<Events>>) {
        let value;
        Object.getOwnPropertyNames(listeners).forEach(name => {
            value = listeners[name as keyof Events]!;
            if (typeof value === 'function') {
                this.addListener(name as keyof Events, value);
            } else {
                this.addListener(name as keyof Events, value.listener, value.once);
            }
        });
        Object.getOwnPropertySymbols(listeners).forEach(symbol => {
            value = listeners[symbol as keyof Events]!;
            if (typeof value === 'function') {
                this.addListener(symbol as keyof Events, value);
            } else {
                this.addListener(symbol as keyof Events, value.listener, value.once);
            }
        });
    }
    /** dts2md break */
    /**
     * Returns `(node === this) ||
     * (node.parentNode && this.containsChild(node.parentNode))`.
     */
    containsChild(node: CanvasNode<Events>): boolean {
        let currentNode: CanvasNode<Events> | null = node;
        while (currentNode) {
            if (currentNode === this) {
                return true;
            }
            currentNode = currentNode._parentNode;
        }
        return false;
    }
    /** dts2md break */
    /**
     * Removes a child node.
     */
    removeChild(node: CanvasNode<Events>) {

        if (node._parentNode !== this) {
            throw new Error('accept a child node of this node');
        }

        const { _childNodes } = this;

        const index = _childNodes.indexOf(node);
        if (index === -1) {
            throw new Error('failed to find the child node');
        }

        removeElements(_childNodes, index, 1);
        node._parentNode = null;

    }
    /** dts2md break */
    /**
     * Append a new child node.
     */
    appendChild(node: CanvasNode<Events>) {

        if (node.isRoot) {
            throw new TypeError('root nodes can not have parent nodes');
        }

        if (node._parentNode) {
            if (node._parentNode === this) {
                return this;
            }
            node._parentNode.removeChild(node);
        }

        this._childNodes.push(node);
        node._parentNode = this as CanvasNode<Events>;

        return this;

    }
    /** dts2md break */
    /**
     * Replace an old child node with a new one.
     */
    replaceChild(oldNode: CanvasNode<Events>, newNode: CanvasNode<Events>) {

        if (newNode.isRoot) {
            throw new TypeError('root nodes can not have parent nodes');
        }

        const { _childNodes } = this;

        const index = _childNodes.indexOf(oldNode);
        if (index === -1) {
            throw new Error('failed to find the old node');
        }

        if (oldNode === newNode) {
            return this;
        }

        if (newNode._parentNode) {
            if (newNode._parentNode === this) {
                return this;
            }
            newNode._parentNode.removeChild(newNode);
        }

        oldNode._parentNode = null;
        _childNodes[index] = newNode;
        newNode._parentNode = this as CanvasNode<Events>;

        return this;

    }
    /** dts2md break */
    /**
     * Insert a new child node before the reference one.
     */
    insertBefore(referenceNode: CanvasNode<Events> | null, newNode: CanvasNode<Events>) {

        if (newNode.isRoot) {
            throw new TypeError('root nodes can not have parent nodes');
        }

        const { _childNodes } = this;

        const index = referenceNode
            ? _childNodes.indexOf(referenceNode)
            : _childNodes.length;
        if (index === -1) {
            throw new Error('failed to find the reference node');
        }

        if (referenceNode === newNode) {
            return this;
        }

        if (newNode._parentNode) {
            if (newNode._parentNode === this) {
                return this;
            }
            newNode._parentNode.removeChild(newNode);
        }

        insertElement(_childNodes, index, newNode);
        newNode._parentNode = this as CanvasNode<Events>;

        return this;

    }
    /** dts2md break */
    /**
     * Emit an event on this node
     * and repeat on child nodes.
     */
    broadcast(event: Utils.ValueType<Events>) {
        this.emit(event);
        this._childNodes.forEach(childNode => {
            childNode.broadcast(event);
        });
        return this;
    }
    /** dts2md break */
    /**
     * A hook invoked before any other update.
     * (optional)
     */
    protected beforeUpdate?(timeStamp: number): void;
    /** dts2md break */
    /**
     * A hook invoked during updating.
     * (optional; typically used to update layout)
     */
    protected updateLayout?(timeStamp: number): void;
    /** dts2md break */
    /**
     * A hook invoked after update finishes.
     * (optional)
     */
    protected afterUpdate?(timeStamp: number): void;

    private _initUpdate(timeStamp: number) {
        this.beforeUpdate?.(timeStamp);
        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._initUpdate(timeStamp);
            });
        }
        this.layoutOffsetX = 0;
        this.layoutOffsetY = 0;
    }

    private _invokeUpdateLayout(timeStamp: number) {
        this.updateLayout?.(timeStamp);
        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._invokeUpdateLayout(timeStamp);
            });
        }
    }

    private _invokeAfterUpdate(timeStamp: number) {
        this.afterUpdate?.(timeStamp);
        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._invokeAfterUpdate(timeStamp);
            });
        }
    }

    private _updateLayout(timeStamp: number) {

        const { offsetX, offsetY, bounds } = this;
        let x: number;
        let y: number;

        switch (this.position) {
            case 'absolute': {
                x = offsetX;
                y = offsetY;
                break;
            }
            case 'relative': {
                const { _parentNode } = this;
                if (_parentNode) {
                    x = offsetX + _parentNode._x;
                    y = offsetY + _parentNode._y;
                } else {
                    x = offsetX;
                    y = offsetY;
                }
                break;
            }
            default: {
                throw new Error('unknown positioning mode');
            }
        }

        x += this.layoutOffsetX;
        y += this.layoutOffsetY;

        this._x = x;
        this._y = y;
        bounds.left = x;
        bounds.top = y;

        Style.compute(
            this._computedStyle,
            this._parentNode?._computedStyle ?? Style.defaults,
            this.style,
        );

        this.updateLayout?.(timeStamp);

        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._updateLayout(timeStamp);
            });
        }

    }
    /** dts2md break */
    /**
     * Update this node synchronously following the procedures below:
     * 1. Invoke `beforeUpdate` on this node and child nodes;
     * 2. Update layout:
     *     - Compute layout of this node;
     *     - Invoke `updateLayout` on this node;
     *     - repeat on child nodes;
     * 3. Invoke `afterUpdate` on this node and child nodes.
     */
    updateSync(timeStamp: number) {
        if (this.noUpdate) {
            return;
        }
        this._initUpdate(timeStamp);
        this._updateLayout(timeStamp);
        this._invokeAfterUpdate(timeStamp);
    }
    /** dts2md break */
    /**
     * Update this node asynchronously.
     * (equal to `Schedule.update(thisNode)`)
     */
    update() {
        if (this.noUpdate) {
            return;
        }
        Schedule.update(this);
    }
    /** dts2md break */
    /**
     * Render the content of this node.
     * (Remember to restore the transform states
     * of rendering context if you have changed them
     * in your implemention code.)
     */
    protected renderSelf?(renderer: Renderer): void;
    /** dts2md break */
    /**
     * Render the node and its child nodes synchronously.
     * (Invokes {@link renderSelf} internally.)
     */
    renderSync(renderer: Renderer) {

        if (!this.visible) {
            return;
        }

        const { _computedStyle, bounds } = this;
        const { context } = renderer;

        Style.applyCommon(_computedStyle, context);
        this.renderSelf?.(renderer);

        if (!this.noChildRender) {
            this._childNodes.forEach(childNode => {
                childNode.renderSync(renderer);
            });
        }

        if (_computedStyle.boundsStyle) {
            Style.applyBounds(_computedStyle, context);
            context.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
        }

    }
    /** dts2md break */
    /**
     * Returns `true` if (x, y) is inside the bounds of this node.
     * (You can override this to achieve more precise detection.)
     */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

}
