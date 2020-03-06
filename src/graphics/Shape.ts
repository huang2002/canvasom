import { NodeOptions, Node } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type ShapeOptions = NodeOptions & Partial<{
    closePath: boolean;
    clipPath: boolean;
}>;
/** dts2md break */
export abstract class Shape extends Node implements Required<ShapeOptions> {

    /** dts2md break */
    static defaults: ShapeOptions = {
        closePath: true,
        clipPath: false
    };

    /** dts2md break */
    /**
     * Internal canvas
     */
    static readonly _canvas = document.createElement('canvas');
    static readonly _context = Shape._canvas.getContext('2d')!;

    /** dts2md break */
    constructor(options?: Readonly<ShapeOptions>) {
        super();
        Object.assign(this, Shape.defaults, options);
    }

    /** dts2md break */
    /**
     * Whether to close the path of the shape
     */
    closePath!: boolean;
    /** dts2md break */
    /**
     * Whether to clip the inner content using the path
     */
    clipPath!: boolean;

    /** dts2md break */
    /**
     * Illustrate the path of the shape
     * (when implementing your custom shape, note that
     * the context will be automatically translated to
     * position (this.left, this.top). So, you illustrate
     * your path as if the shape were at position (0, 0).)
     */
    abstract path(context: CanvasRenderingContext2D): void;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        if (!this.bounds.containsPoint(x, y)) {
            return false;
        }
        const { _context } = Shape;
        _context.beginPath();
        this.path(_context);
        return _context.isPointInPath(x - this.left, y - this.top);
    }

    /** dts2md break */
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
