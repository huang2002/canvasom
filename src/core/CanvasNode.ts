import { type Event, EventEmitter, EventListeners, addListeners } from "3h-event";
import { insertElement, merge, removeElements } from "3h-utils";
import { CanvasStyle, Style } from '../common/Style';
import type { Renderer } from './Renderer';
import { Bounds } from '../common/Bounds';
import { Vector } from '../common/Vector';
import { Utils } from "../common/Utils";
import { Schedule } from '../common/Schedule';
import type { CanvasRoot } from './CanvasRoot';
import { NodeRecord, NodeRecordOptions, NodeRecordValue } from '../utils/createFromRecord';
import { registry } from '../common/registry';

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
    target: CanvasNode<any>;
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
 * Type map of events on canvas nodes.
 */
export type CanvasNodeEvents = {
    pointerstart: CanvasPointerStartEvent;
    pointermove: CanvasPointerMoveEvent;
    pointerend: CanvasPointerEndEvent;
    click: CanvasClickEvent;
    wheel: CanvasWheelEvent;
};
/** dts2md break */
/**
 * Type of offset mode of canvas nodes.
 * 'relative' - Relative to the parent node.
 * 'absolute' - Relative to the root node.
 */
export type CanvasNodeOffsetMode = 'relative' | 'absolute';
/** dts2md break */
/**
 * Type of options of {@link CanvasNode}.
 */
export type CanvasNodeOptions<Events extends CanvasNodeEvents> = Partial<{
    /**
     * The unique identity of the node.
     * @default ''
     */
    id: string;
    /**
     * The class names of the node.
     * @default []
     */
    classNames: string[];
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
    /** dts2md break */
    /**
     * The offset of this node.
     * @default new Vector(offsetX, offsetY)
     */
    offset: Vector;
    /**
     * Set `bounds.width`.
     */
    boundsWidth: number;
    /**
     * Set `bounds.height`.
     */
    boundsHeight: number;
    /**
     * If this is a number, the width of the node
     * will be adjusted before update so that
     * `thisBounds.width / parentBounds.width === stretchX`.
     * @default options.stretch
     */
    stretchX: number | null;
    /**
     * If this is a number, the height of the node
     * will be adjusted before update so that
     * `thisBounds.height / parentBounds.height === stretchY`.
     * @default options.stretch
     */
    stretchY: number | null;
    /**
     * Default value of `stretchX` and `stretchY`.
     * @default null
     */
    stretch: number | null;
    /**
     * The positioning mode of this node.
     * (Controls how `offset` functions.)
     * @default 'relative'
     */
    offsetMode: CanvasNodeOffsetMode;
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
     * Whether to skip update when the node is invisible.
     * @default true
     */
    smartUpdate: boolean;
    /**
     * Add a few event listeners by providing a dict.
     * (eventName -> listener | listenerRecord)
     * @example
     * ```js
     * COM.create(COM.RectNode, {
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
    listeners: Partial<EventListeners<Events>>;
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

        const defaultStretch = options?.stretch ?? null;

        this.id = options?.id ?? '';
        this.classNames = options?.classNames ?? [];
        this.offset = options?.offset ?? new Vector(
            options?.offsetX ?? 0,
            options?.offsetY ?? 0,
        );
        this.stretchX = options?.stretchX ?? defaultStretch;
        this.stretchY = options?.stretchY ?? defaultStretch;
        this.offsetMode = options?.offsetMode ?? 'relative';
        this.visible = options?.visible ?? true;
        this.interactive = options?.interactive ?? false;
        this.penetrable = options?.penetrable ?? false;
        this.style = options?.style ?? (Object.create(null) as {});
        this.noUpdate = options?.noUpdate ?? false;
        this.smartUpdate = options?.smartUpdate ?? true;

        if (options?.listeners) {
            addListeners(this, options.listeners);
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
     * The absolute position of the node.
     * (Relative to the root; updated internally.)
     */
    readonly position = new Vector();
    /** dts2md break */
    /**
     * The bounds of this node.
     */
    readonly bounds = new Bounds();
    /** dts2md break */
    /**
     * The tag name of the node.
     * @default ''
     */
    readonly tag: string = '';
    /** dts2md break */
    /**
     * The unique identity of the node.
     * @default ''
     */
    id: string;
    /** dts2md break */
    /**
     * The class names of the node.
     * @default []
     */
    classNames: string[];
    /** dts2md break */
    /**
     * The offset of this node.
     */
    offset: Vector;
    /** dts2md break */
    /**
     * If this is a number, the width of the node
     * will be adjusted before update so that
     * `thisBounds.width / parentBounds.width === stretchX`.
     * @default null
     */
    stretchX: number | null;
    /** dts2md break */
    /**
     * If this is a number, the height of the node
     * will be adjusted before update so that
     * `thisBounds.height / parentBounds.height === stretchY`.
     * @default null
     */
    stretchY: number | null;
    /** dts2md break */
    /**
     * The positioning mode of this node.
     * (Controls how `offset` functions.)
     * @default 'relative'
     */
    offsetMode: CanvasNodeOffsetMode;
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
     * Whether to skip update when the node is invisible.
     * @default true
     */
    smartUpdate: boolean;
    /** dts2md break */
    /**
     * The x offset in layout.
     * (This should be set by layout parent nodes.)
     * @default 0
     */
    layoutOffsetX = 0;
    /** dts2md break */
    /**
     * The y offset in layout.
     * (This should be set by layout parent nodes.)
     * @default 0
     */
    layoutOffsetY = 0;
    /** dts2md break */
    /**
     * Whether this is a root node.
     * (See {@link CanvasRoot}.)
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

    private _parentNode: CanvasNode<Events> | null = null;
    private _childNodes: CanvasNode<Events>[] = [];
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
     * Get `thisNode.offset.x`.
     */
    get offsetX() {
        return this.offset.x;
    }
    /** dts2md break */
    /**
     * Set `thisNode.offset.x`.
     */
    set offsetX(offsetX: number) {
        this.offset.x = offsetX;
    }
    /** dts2md break */
    /**
     * Get `thisNode.offset.y`.
     */
    get offsetY() {
        return this.offset.y;
    }
    /** dts2md break */
    /**
     * Set `thisNode.offset.y`.
     */
    set offsetY(offsetY: number) {
        this.offset.y = offsetY;
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
     * Get the root node.
     * (Returns `null` if not available.)
     */
    getRoot(): CanvasRoot<Events> | null {
        let currentNode: CanvasNode<Events> | null = this;
        while (currentNode) {
            if (currentNode.isRoot) {
                return currentNode as CanvasRoot<Events>;
            } else {
                currentNode = currentNode._parentNode;
            }
        }
        return null;
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
     * Remove a child node.
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
     * Remove all child nodes.
     */
    clearChildNodes() {
        const { _childNodes } = this;
        _childNodes.forEach(childNode => {
            childNode._parentNode = null;
        });
        _childNodes.length = 0;
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
     * Select a descendent node with specific id.
     * (Returns `null` if not found.)
     */
    selectId(id: string): CanvasNode<Events> | null {
        return Utils.selectId(id, this);
    }
    /** dts2md break */
    /**
     * Select descendent nodes with specific class name.
     */
    selectClass(className: string): CanvasNode<Events>[] {
        return Utils.selectClass(className, this);
    }
    /** dts2md break */
    /**
     * Select descendent nodes with specific tag name.
     */
    selectTag(tag: string): CanvasNode<Events>[] {
        return Utils.selectTag(tag, this);
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
     * A hook invoked right after automatic stretch
     * and before any other update.
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
    /** dts2md break */
    /**
     * A hook invoked after locating.
     */
    protected afterLocating?(timeStamp: number): void;

    private _initUpdate(timeStamp: number) {

        // stretch
        const { _parentNode } = this;
        if (_parentNode) {
            const { bounds: selfBounds, stretchX, stretchY } = this;
            const { bounds: parentBounds } = _parentNode;
            if (stretchX !== null) {
                selfBounds.width = parentBounds.width * stretchX;
            }
            if (stretchY !== null) {
                selfBounds.height = parentBounds.height * stretchY;
            }
        }

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

        const { offset, bounds } = this;
        let x: number;
        let y: number;

        switch (this.offsetMode) {

            case 'absolute': {
                x = offset.x;
                y = offset.y;
                break;
            }

            case 'relative': {
                const { _parentNode } = this;
                if (_parentNode) {
                    const { position: parentPosition } = _parentNode;
                    x = offset.x + parentPosition.x + this.layoutOffsetX;
                    y = offset.y + parentPosition.y + this.layoutOffsetY;
                } else {
                    x = offset.x;
                    y = offset.y;
                }
                break;
            }

            default: {
                throw new TypeError('unknown positioning mode');
            }

        }

        this.position.set(x, y);
        bounds.left = x;
        bounds.top = y;

        this.afterLocating?.(timeStamp);

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
     * Locate the node.
     * (You can invoke this to re-locate nodes
     * whose positions are changed in `updateLayout` or `afterUpdate`
     * so that they will be rendered at newest positions.)
     */
    locate(timeStamp: number) {

        const { offset, bounds } = this;
        let x: number;
        let y: number;

        switch (this.offsetMode) {

            case 'absolute': {
                x = offset.x;
                y = offset.y;
                break;
            }

            case 'relative': {
                const { _parentNode } = this;
                if (_parentNode) {
                    const { position: parentPosition } = _parentNode;
                    x = offset.x + parentPosition.x + this.layoutOffsetX;
                    y = offset.y + parentPosition.y + this.layoutOffsetY;
                } else {
                    x = offset.x;
                    y = offset.y;
                }
                break;
            }

            default: {
                throw new TypeError('unknown positioning mode');
            }

        }

        this.position.set(x, y);
        bounds.left = x;
        bounds.top = y;

        this.afterLocating?.(timeStamp);

        if (!this.noChildUpdate) {
            this._childNodes.forEach(childNode => {
                childNode.locate(timeStamp);
            });
        }

    }
    /** dts2md break */
    /**
     * Update this node synchronously following the procedures below:
     * 1. Automatically stretch according to `this.stretch`;
     * 2. Invoke `beforeUpdate` on this node and child nodes;
     * 3. Update layout:
     *     - Compute layout of this node;
     *     - Invoke `updateLayout` on this node;
     *     - repeat on child nodes;
     * 4. Invoke `afterUpdate` on this node and child nodes.
     */
    updateSync(timeStamp: number) {
        if (this.noUpdate || (this.smartUpdate && !this.visible)) {
            return;
        }
        this._initUpdate(timeStamp);
        this._updateLayout(timeStamp);
        this._invokeAfterUpdate(timeStamp);
    }
    /** dts2md break */
    /**
     * Update this node asynchronously.
     * (equal to `!thisNode.noUpdate && Schedule.update(thisNode)`)
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
    /** dts2md break */
    /**
     * Returns the options for record creation.
     * (Remember to override this when declaring a subclass
     * with extended options.)
     */
    getRecordOptions(): NodeRecordOptions {
        const filteredStyle = merge(this.style); // copy
        if (
            filteredStyle.fillStyle
            && (typeof filteredStyle.fillStyle !== 'string')
        ) {
            throw new TypeError(
                'encountered non-serializable fill style'
            );
        }
        if (
            filteredStyle.strokeStyle
            && (typeof filteredStyle.strokeStyle !== 'string')
        ) {
            throw new TypeError(
                'encountered non-serializable stroke style'
            );
        }
        if (
            filteredStyle.boundsStyle
            && (typeof filteredStyle.boundsStyle !== 'string')
        ) {
            throw new TypeError(
                'encountered non-serializable bounds style'
            );
        }
        return {
            id: this.id,
            classNames: this.classNames,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            boundsWidth: this.bounds.width,
            boundsHeight: this.bounds.height,
            stretchX: this.stretchX,
            stretchY: this.stretchY,
            offsetMode: this.offsetMode,
            visible: this.visible,
            interactive: this.interactive,
            penetrable: this.penetrable,
            style: filteredStyle as NodeRecordValue,
            noUpdate: this.noUpdate,
            smartUpdate: this.smartUpdate,
        };
    }
    /** dts2md break */
    /**
     * Returns a record object that can be used to serialize this node.
     * (Invokes `this.getRecordOptions` internally.)
     */
    toRecord(): NodeRecord {
        const record: NodeRecord = {
            tag: this.tag,
            options: this.getRecordOptions(),
        };
        if (this._childNodes.length) {
            record.childNodes = this._childNodes.map(
                childNode => childNode.toRecord()
            );
        }
        return record;
    }

}

registry.set('', CanvasNode);
