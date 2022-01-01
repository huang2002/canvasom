import { Event, EventEmitter } from "3h-event";
import { insertElement, removeElements } from "3h-utils";
import { CanvasStyle, Style } from '../common/Style';
import { type Renderer } from './Renderer';
import { Bounds } from '../common/Bounds';
import { Utils } from "../common/Utils";

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
 * Type of pointer events on canvas nodes.
 */
export type CanvasPointerEvent = (
    | Event<'pointerstart', CanvasPointerEventData>
    | Event<'pointermove', CanvasPointerEventData>
    | Event<'pointerend', CanvasPointerEventData>
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
 * Type of events on canvas nodes.
 */
export type CanvasNodeEvent = (
    | CanvasPointerEvent
    | CanvasWheelEvent
);
/** dts2md break */
/**
 * Type of position parameters of canvas nodes.
 * 'relative' - Relative to the parent node.
 * 'absolute' - Relative to the root node.
 */
export type CanvasNodePosition = 'relative' | 'absolute';
/** dts2md break */
/**
 * Type of `CanvasNode` options.
 */
export type CanvasNodeOptions<EventType extends CanvasNodeEvent> = Partial<{
    /**
     * The x-offset of this node.
     */
    offsetX: number;
    /**
     * The y-offset of this node.
     */
    offsetY: number;
    /**
     * The positioning mode of this node.
     * @default 'relative'
     */
    position: CanvasNodePosition;
    /**
     * Whether the node should be rendered.
     * @default true
     */
    visibility: boolean;
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
     */
    style: Partial<CanvasStyle>;
    /**
     * Whether the node should be updated.
     * @default false
     */
    noUpdate: boolean;
    /**
     * eventName -> listener | listenerRecord
     * @example
     * ```js
     * COM.create(COM.Rect, {
     *     // ...
     *     listeners: {
     *         click: clickListener,
     *         pointerstart: {
     *             listener: pointerStartListener,
     *             once: true,
     *         },
     *     },
     * });
     * ```
     */
    listeners: Partial<Utils.EventListeners<EventType>>;
}>;
/**
 * Class of canvas object nodes.
 */
export class CanvasNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends EventEmitter<EventType> {
    /** dts2md break */
    /**
     * Constructor of `CanvasNode`.
     */
    constructor(options?: CanvasNodeOptions<EventType>) {
        super();
        this.offsetX = options?.offsetX ?? 0;
        this.offsetY = options?.offsetY ?? 0;
        this.position = options?.position ?? 'relative';
        this.visibility = options?.visibility ?? true;
        this.interactive = options?.interactive ?? false;
        this.penetrable = options?.penetrable ?? false;
        this.style = options?.style ?? (Object.create(null) as {});
        this.noUpdate = options?.noUpdate ?? false;
        if (options?.listeners) {
            this.listeners = options.listeners;
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
     */
    offsetX: number;
    /** dts2md break */
    /**
     * The y-offset of this node.
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
    visibility: boolean;
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
    /**
     * The y offset in layout.
     * (This should be set by layout parent nodes.)
     * @default 0
     */
    protected layoutOffsetY = 0;

    private _parentNode: CanvasNode | null = null;
    private _childNodes: CanvasNode[] = [];
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
    get childNodes(): readonly CanvasNode[] {
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
     */
    get computedStyle() {
        return this._computedStyle;
    }
    /** dts2md break */
    /**
     * @see CanvasNodeOptions.listeners
     */
    set listeners(listeners: Partial<Utils.EventListeners<EventType>>) {
        let value;
        Object.getOwnPropertyNames(listeners).forEach(name => {
            value = listeners[name as keyof typeof listeners]!;
            if (typeof value === 'function') {
                this.addListener(name as EventType['name'], value);
            } else {
                this.addListener(name as EventType['name'], value.listener, value.once);
            }
        });
        Object.getOwnPropertySymbols(listeners).forEach(symbol => {
            value = listeners[symbol as unknown as keyof typeof listeners]!;
            if (typeof value === 'function') {
                this.addListener(symbol as unknown as EventType['name'], value);
            } else {
                this.addListener(symbol as unknown as EventType['name'], value.listener, value.once);
            }
        });
    }
    /** dts2md break */
    /**
     * Returns `(node === this) ||
     * (node.parentNode && this.containsChild(node.parentNode))`.
     */
    containsChild(node: CanvasNode): boolean {
        let currentNode: CanvasNode | null = node;
        while (currentNode) {
            if (currentNode === (this as unknown as CanvasNode)) {
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
    removeChild(node: CanvasNode) {

        if (node._parentNode !== (this as unknown as CanvasNode)) {
            throw new Error('accept a child node of this node');
        }

        const index = this._childNodes.indexOf(node);
        if (index === -1) {
            throw new Error('failed to find the child node');
        }

        removeElements(this._childNodes, index, 1);
        node._parentNode = null;

    }
    /** dts2md break */
    /**
     * Append a new child node.
     */
    appendChild(node: CanvasNode) {

        if (node.isRoot) {
            throw new TypeError('root nodes can not have parent nodes');
        }

        if (node._parentNode) {
            if (node._parentNode === (this as any)) {
                return this;
            }
            node._parentNode.removeChild(node);
        }

        this._childNodes.push(node);
        node._parentNode = this as unknown as CanvasNode;

        return this;

    }
    /** dts2md break */
    /**
     * Insert a new child node before the reference one.
     */
    insertBefore(referenceNode: CanvasNode | null, newNode: CanvasNode) {

        if (newNode.isRoot) {
            throw new TypeError('root nodes can not have parent nodes');
        }

        const index = referenceNode
            ? this._childNodes.indexOf(referenceNode)
            : this._childNodes.length;
        if (index === -1) {
            throw new Error('failed to find the reference node');
        }

        if (referenceNode === newNode) {
            return this;
        }

        if (newNode._parentNode) {
            if (newNode._parentNode === (this as any)) {
                return this;
            }
            newNode._parentNode.removeChild(newNode);
        }

        insertElement(this._childNodes, index, newNode);
        newNode._parentNode = this as unknown as CanvasNode;

        return this;

    }
    /** dts2md break */
    /**
     * Emit an event on this node
     * and repeat on child nodes.
     */
    broadcast(event: EventType) {
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
    protected beforeUpdate?(): void;
    /** dts2md break */
    /**
     * A hook invoked during updating.
     * (optional; typically used to update layout)
     */
    protected updateLayout?(): void;
    /** dts2md break */
    /**
     * A hook invoked after update finishes.
     * (optional)
     */
    protected afterUpdate?(): void;

    private _initUpdate() {
        this.beforeUpdate?.();
        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._initUpdate();
            });
        }
        this.layoutOffsetX = 0;
        this.layoutOffsetY = 0;
    }

    private _invokeUpdateLayout() {
        this.updateLayout?.();
        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._invokeUpdateLayout();
            });
        }
    }

    private _invokeAfterUpdate() {
        this.afterUpdate?.();
        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._invokeAfterUpdate();
            });
        }
    }

    private _updateLayout() {

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

        this.updateLayout?.();

        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode._updateLayout();
            });
        }

    }
    /** dts2md break */
    /**
     * Update this node following the procedures below:
     * 1. Invoke `beforeUpdate` on this node and child nodes;
     * 2. Update layout:
     *     - Compute layout of this node;
     *     - Invoke `updateLayout` on this node;
     *     - repeat on child nodes;
     * 3. Invoke `afterUpdate` on this node and child nodes.
     */
    update() {
        if (this.noUpdate) {
            return;
        }
        this._initUpdate();
        this._updateLayout();
        this._invokeAfterUpdate();
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
     * Render the node and its child nodes.
     * (Invokes `renderSelf` internally.)
     */
    render(renderer: Renderer) {

        if (!this.visibility) {
            return;
        }

        const { _computedStyle, bounds } = this;
        const { context } = renderer;

        Style.apply(_computedStyle, context);
        this.renderSelf?.(renderer);

        if (!this.noChildRender) {
            this._childNodes.forEach(childNode => {
                childNode.render(renderer);
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
