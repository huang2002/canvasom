import { NodeOptions, Node } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type ShapeOptions = NodeOptions & Partial<{
    closePath: boolean;
}>;

export abstract class Shape extends Node implements Required<ShapeOptions> {

    static defaults: ShapeOptions = {
        closePath: true,
    };

    static readonly _canvas = document.createElement('canvas');
    static readonly _context = Shape._canvas.getContext('2d')!;

    constructor(options?: Readonly<ShapeOptions>) {
        super();
        Object.assign(this, Shape.defaults, options);
    }

    closePath!: boolean;

    abstract path(context: CanvasRenderingContext2D): void;

    containsPoint(x: number, y: number) {
        if (!this.bounds.containsPoint(x, y)) {
            return false;
        }
        const { _context } = Shape;
        _context.beginPath();
        this.path(_context);
        return _context.isPointInPath(x - this.left, y - this.top);
    }

    protected _render(context: CanvasRenderingContext2D) {
        const { computedStyle } = this;
        context.beginPath();
        this.path(context);
        if (this.closePath) {
            context.closePath();
        }
        if (computedStyle.fillStyle) {
            context.fill();
            context.shadowColor = Utils.Const.TRANSPARENT;
        }
        if (computedStyle.strokeStyle) {
            context.stroke();
        }
        Utils.renderNodes(this.childNodes, context);
    }

}
