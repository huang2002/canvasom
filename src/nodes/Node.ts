import { Utils } from '../common/Utils';
import { Bounds } from '../common/Bounds';
import { CanvasStyle, Style } from '../common/Style';
import { Schedule } from '../common/Schedule';
import { EventTarget, Listener } from '../events/EventTarget';

export interface ListenerDeclaration {
    [type: string]: Listener | { listener: Listener; once: boolean; };
}

export type NodeOptions = Partial<{
    visible: boolean;
    interactive: boolean;
    penetrable: boolean;
    x: number;
    y: number;
    style: Partial<CanvasStyle>;
    listeners: ListenerDeclaration;
}>;

export abstract class Node extends EventTarget implements Required<NodeOptions> {

    static defaults: NodeOptions = {
        visible: true,
        interactive: false,
        penetrable: false,
        x: 0,
        y: 0,
    };

    constructor(options?: Readonly<NodeOptions>) {
        super();
        Object.assign(this, Node.defaults, options);
    }

    readonly childNodes = new Array<Node>();
    readonly bounds = new Bounds();
    readonly left: number = 0;
    readonly top: number = 0;
    readonly computedStyle: Readonly<CanvasStyle> = Object.assign(
        Object.create(null),
        Style.defaults
    );
    visible!: boolean;
    interactive!: boolean;
    penetrable!: boolean;
    x!: number;
    y!: number;
    style: Partial<CanvasStyle> = {};
    protected _parent: Node | null = null;
    protected _fixedBounds = false;

    get parentNode() {
        return this._parent;
    }

    set listeners(listeners: ListenerDeclaration) {
        Object.keys(listeners).forEach(type => {
            const declaration = listeners[type];
            if (typeof declaration === 'function') {
                this.addListener(type, declaration);
            } else {
                this.addListener(type, declaration.listener, declaration.once);
            }
        });
    }

    contains(node: Node) {
        let current = node;
        while (current !== this && current._parent) {
            current = current._parent;
        }
        return current === this;
    }

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

    protected _compute?(): void;

    compute() {
        const { bounds, x, y, _parent, childNodes } = this;
        if (_parent) {
            bounds.init(
                (this.left as number) = _parent.left + x,
                (this.top as number) = _parent.top + y
            );
            Style.compute(this.computedStyle, _parent.computedStyle, this.style);
        } else {
            bounds.init(
                (this.left as number) = x,
                (this.top as number) = y
            );
            Style.compute(this.computedStyle, Style.defaults, this.style);
        }
        if (this._compute) {
            this._compute();
        }
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        if (!this._fixedBounds) {
            bounds.contain(childNodes);
        }
    }

    containsPoint?(x: number, y: number): boolean;

    protected abstract _render(context: CanvasRenderingContext2D): void;

    render(context: CanvasRenderingContext2D) {
        if (!this.visible) {
            return;
        }
        const { x, y } = this;
        context.translate(x, y);
        Style.apply(context, this.computedStyle);
        this._render(context);
        context.translate(-x, -y);
    }

    update(properties: Partial<ThisType<this>>) {
        Object.assign(this, properties);
        Schedule.mark(this);
        return this;
    }

    updateStyle(properties: Partial<CanvasStyle>) {
        Object.assign(this.style, properties);
        Schedule.mark(this);
        return this;
    }

}
