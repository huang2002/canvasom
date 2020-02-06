import { Utils } from '../common/Utils';
import { Bounds } from '../common/Bounds';
import { CanvasStyle, Style } from '../common/Style';
import { Schedule } from '../common/Schedule';
import { EventTarget, Listener } from '../events/EventTarget';

export interface ListenerDeclaration {
    [type: string]: Listener | { listener: Listener; once: boolean; };
}

export type NodeOptions = Partial<{
    id: string;
    classNames: string[];
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

    abstract readonly tag: string;
    readonly id: string = '';
    readonly classNames = new Array<string>();
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

    protected _compute() {
        this.childNodes.forEach(childNode => {
            childNode.compute();
        });
    }

    compute() {
        const { bounds, x, y, _parent } = this;
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
        this._compute();
    }

    containsPoint?(x: number, y: number): boolean;

    protected abstract _render(context: CanvasRenderingContext2D): void;

    render(context: CanvasRenderingContext2D) {
        if (!this.visible) {
            return;
        }
        Style.apply(context, this.computedStyle);
        this._render(context);
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
