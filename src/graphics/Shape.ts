import { NodeOptions, Node } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type ShapeOptions = NodeOptions & Partial<{
    closePath: boolean;
    clipPath: boolean;
}>;

export abstract class Shape extends Node implements Required<ShapeOptions> {

    static defaults: ShapeOptions = {
        closePath: true,
        clipPath: false
    };

    static readonly _canvas = document.createElement('canvas');
    static readonly _context = Shape._canvas.getContext('2d')!;

    constructor(options?: Readonly<ShapeOptions>) {
        super();
        Object.assign(this, Shape.defaults, options);
    }

    closePath!: boolean;
    clipPath!: boolean;

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
        const { computedStyle, clipPath, left, top } = this;
        context.translate(left, top);
        context.beginPath();
        this.path(context);
        if (this.closePath) {
            context.closePath();
        }
        context.translate(-left, -top);
        if (computedStyle.fillStyle) {
            context.fill();
            context.shadowColor = Utils.Const.TRANSPARENT;
        }
        if (clipPath) {
            context.save();
            context.clip();
            Utils.renderNodes(this.childNodes, context);
            context.restore();
        }
        if (computedStyle.strokeStyle) {
            context.stroke();
        }
        if (!clipPath) {
            Utils.renderNodes(this.childNodes, context);
        }
    }

}
