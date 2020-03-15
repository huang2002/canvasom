import { Utils } from '../common/Utils';
import { Bounds } from '../common/Bounds';
import { CanvasStyle, Style } from '../common/Style';
import { Schedule } from '../common/Schedule';
import { EventTargetOptions, EventTarget } from '../events/EventTarget';
import { AnimationOptions, Animation } from '../animation/Animation';

export type NodeOptions = EventTargetOptions & Partial<{
    id: string;
    classNames: string[];
    visible: boolean;
    interactive: boolean;
    penetrable: boolean;
    x: number;
    y: number;
    style: Partial<CanvasStyle>;
}>;
/** dts2md break */
/**
 * The base class of nodes that is extended and implemented
 * by many other classes to provide various node types
 * (you can also extend and implement yours if really needed)
 */
export abstract class Node extends EventTarget implements Required<NodeOptions> {

    /** dts2md break */
    static defaults: NodeOptions = {
        visible: true,
        interactive: false,
        penetrable: false,
        x: 0,
        y: 0,
    };

    /** dts2md break */
    constructor(options?: Readonly<NodeOptions>) {
        super();
        Object.assign(this, Node.defaults, options);
    }

    /** dts2md break */
    /**
     * The tag name of the node
     * (all extended node types should specify their own
     * unique tags and the tag should be used as the key
     * to store theirs constructors in node the registry)
     */
    abstract readonly tag: string;
    /** dts2md break */
    /**
     * The id of the node, which should be unique
     */
    readonly id: string = '';
    /** dts2md break */
    /**
     * The class name list of the node
     */
    readonly classNames = new Array<string>();
    /** dts2md break */
    /**
     * The child nodes of the node
     */
    readonly childNodes = new Array<Node>();
    /** dts2md break */
    /**
     * The computed bounds of the node
     * (can be adjusted internally)
     */
    readonly bounds = new Bounds();
    /** dts2md break */
    /**
     * The computed left/top position of the node
     * (differs from `bounds.left/top`; These two
     * properties are computed automatically and
     * used as the initial left/top of the bounds;
     * use these two as the reference point of your
     * rendering instead of `bounds.left/top`)
     */
    readonly left: number = 0;
    readonly top: number = 0;
    /** dts2md break */
    /**
     * The computed style properties
     * (use this in your rendering instead of using `style`)
     */
    readonly computedStyle: Readonly<CanvasStyle> = Object.assign(
        Object.create(null),
        Style.defaults
    );
    /** dts2md break */
    /**
     * Whether the node is visible
     * (If this is set to true, rendering will be skipped)
     * @default true
     */
    visible!: boolean;
    /** dts2md break */
    /**
     * Whether the node is interactive
     * (If this is set to false, not only this node but also
     * its child nodes won't receive interactive events)
     * @default false
     */
    interactive!: boolean;
    /** dts2md break */
    /**
     * If this is set to true, interactive detection will
     * skip this node and detect its child nodes directly
     * @default false
     */
    penetrable!: boolean;
    /** dts2md break */
    /**
     * The offset of the node
     * (this will affect the layout and
     * the positions of child nodes)
     */
    x!: number;
    y!: number;
    /** dts2md break */
    /**
     * The style of the node
     * (you should update this using either `updateStyle`
     * or `update`; or, the updating may have no effect)
     */
    style: Partial<CanvasStyle> = {};
    /** dts2md break */
    protected _parent: Node | null = null;
    /** dts2md break */
    /**
     * Whether the bounds should contain the child nodes'
     */
    protected _flexible = false;
    private _x0 = 0;
    private _y0 = 0;
    private _left = 0;
    private _top = 0;
    private _width = 0;
    private _height = 0;

    /** dts2md break */
    /**
     * The parent node of this node
     */
    get parentNode() {
        return this._parent;
    }

    /** dts2md break */
    /**
     * Tells whether the given node is a child of
     * this node or equals this node
     */
    contains(node: Node | null) {
        if (!node) {
            return false;
        }
        let current = node;
        while (current !== this && current._parent) {
            current = current._parent;
        }
        return current === this;
    }

    /** dts2md break */
    /**
     * Child node manipulating methods
     */

    appendChild<T extends Node>(child: T) {
        if (child._parent) {
            child._parent.removeChild(child);
        }
        this.childNodes.push(child);
        child._parent = this;
        Schedule.mark(this);
        return child;
    }

    removeChild<T extends Node>(child: T) {
        const index = this.childNodes.indexOf(child);
        if (~index) {
            Utils.removeIndex(this.childNodes, index);
            child._parent = null;
            Schedule.mark(this);
        }
        return child;
    }

    replaceChild<T extends Node>(newChild: T, oldChild: Node) {
        const index = this.childNodes.indexOf(oldChild);
        if (~index) {
            if (newChild._parent) {
                newChild._parent.removeChild(newChild);
            }
            oldChild._parent = null;
            this.childNodes[index] = newChild;
            oldChild._parent = this;
            newChild._parent = this;
            Schedule.mark(this);
        }
        return newChild;
    }

    insertBefore<T extends Node>(newChild: T, refChild: Node | null) {
        if (!refChild) {
            return this.appendChild(newChild);
        }
        const index = this.childNodes.indexOf(refChild);
        if (~index) {
            if (newChild._parent) {
                newChild._parent.removeChild(newChild);
            }
            Utils.insertIndex(this.childNodes, index, newChild);
            newChild._parent = this;
            Schedule.mark(this);
        }
        return newChild;
    }

    /** dts2md break */
    /**
     * Select the node(s) with given id/class/tag
     */

    selectId(id: string): Node | null {
        const { childNodes } = this;
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].id === id) {
                return childNodes[i];
            }
            const result = childNodes[i].selectId(id);
            if (result) {
                return result;
            }
        }
        return null;
    }

    selectClass(className: string) {
        const { childNodes } = this;
        let results = new Array<Node>();
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classNames.includes(className)) {
                results.push(childNodes[i]);
            }
            results.push(...childNodes[i].selectClass(className));
        }
        return results;
    }

    selectTag(tag: string) {
        const { childNodes } = this;
        let results = new Array<Node>();
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].tag === tag) {
                results.push(childNodes[i]);
            }
            results.push(...childNodes[i].selectTag(tag));
        }
        return results;
    }

    /** dts2md break */
    /**
     * A computing hook
     * (you can refer to the source code of
     * implementions if you need to override this)
     */
    protected _compute?(): void;

    /** dts2md break */
    /**
     * A layout hook
     * (you can refer to the source code of
     * implementions if you need to override this)
     */
    align?(): void;

    locate() {
        const { _parent, childNodes } = this;
        if (_parent) {
            const dx = _parent.left - this._x0,
                dy = _parent.top - this._y0;
            this._x0 = _parent.left;
            this._y0 = _parent.top;
            this.bounds.move(dx + this.left - this._left, dy + this.top - this._top);
            (this.left as number) += dx;
            (this.top as number) += dy;
            this._left = this.left;
            this._top = this.top;
        }
        for (let i = 0; i < childNodes.length; i++) {
            childNodes[i].locate();
        }
    }

    /** dts2md break */
    /**
     * Used internally to compute node states
     * (you can invoke this to compute node states
     * synchronously if needed; an example is given below)
     * @example
     * ```js
     * // use `update/updateStyle` instead unless you have to
     *
     * setPropertiesDirectly(node); // set some properties directly
     * node.compute(); // compute the states synchronously
     * COM.Schedule.unmark(node); // unmark the node to avoid extra compution
     * ```
     */
    compute() {
        const { bounds, _parent, x, y, childNodes } = this;
        if (_parent) {
            (this.left as number) = _parent.left + x;
            (this.top as number) = _parent.top + y;
            this._x0 = _parent.left;
            this._y0 = _parent.top;
            Style.compute(this.computedStyle, _parent.computedStyle, this.style);
        } else {
            (this.left as number) = x;
            (this.top as number) = y;
            Style.compute(this.computedStyle, Style.defaults, this.style);
        }
        this._left = this.left;
        this._top = this.top;
        bounds.width = bounds.height = 0;
        if (this._compute) {
            this._compute();
        }
        this._width = bounds.width;
        this._height = bounds.height;
        bounds.moveTo(this.left, this.top);
        for (let i = 0; i < childNodes.length; i++) {
            childNodes[i].compute();
        }
        if (this.align) {
            this.align();
            for (let i = 0; i < childNodes.length; i++) {
                childNodes[i].locate();
            }
        }
        if (this._flexible) {
            this.bounds.contain(childNodes);
        }
    }

    /** dts2md break */
    adjustLayout() {
        const { childNodes } = this;
        for (let i = 0; i < childNodes.length; i++) {
            childNodes[i].adjustLayout();
        }
        if (this.align) {
            this.align();
        }
        for (let i = 0; i < childNodes.length; i++) {
            childNodes[i].locate();
        }
        if (this._flexible) {
            const { bounds } = this;
            bounds.moveTo(this.left, this.top);
            bounds.width = this._width;
            bounds.height = this._height;
            bounds.contain(childNodes);
        }
    }

    /** dts2md break */
    /**
     * Tells whether the node contains the point at the given position
     * (this is optionally implemented by extended classes;
     * if a node doesn't implement this and its `penetrable`
     * property is false, interactive detection will skip
     * both the node and its child nodes)
     */
    containsPoint?(x: number, y: number): boolean;

    /** dts2md break */
    /**
     * A rendering hook that extended classes must implement
     * (when implementing your own node type, remember that
     * `this.left/top` is the right start point; you can refer
     * to built-in sub-classes in the source code for examples)
     */
    protected abstract _render(context: CanvasRenderingContext2D): void;

    /** dts2md break */
    /**
     * Render the node using the given canvas 2D context
     */
    render(context: CanvasRenderingContext2D) {
        if (!this.visible) {
            return;
        }
        Style.apply(context, this.computedStyle);
        this._render(context);
    }

    /** dts2md break */
    /**
     * Update the node by giving changed properties
     * (node states will be computed and related roots will be
     * composed, both automatically and asynchronously; you can
     * use `Schedule.nextTick` to wait until the compution is
     * finished to get updated states)
     */
    update(properties: Partial<ThisType<this>>) {
        Object.assign(this, properties);
        Schedule.mark(this);
        return this;
    }

    /** dts2md break */
    /**
     * Similar to update, but updates the style properties
     * (you can also use `update` to update style properties)
     */
    updateStyle(properties: Partial<CanvasStyle>) {
        Object.assign(this.style, properties);
        Schedule.mark(this);
        return this;
    }

    /** dts2md break */
    /**
     * Create an animation effect on the node
     * (the animation will be started immediately)
     */
    animate(options: AnimationOptions<this, ThisType<this>>) {
        const animation = new Animation<this>(options);
        animation.target = this;
        animation.start();
        return animation;
    }

}
