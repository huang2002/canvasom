import { Renderer } from '../core/Renderer';
import { Utils } from '../common/Utils';
import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of `ShapeNode` options.
 */
export type ShapeNodeOptions<EventType extends CanvasNodeEvent> = (
    & CanvasNodeOptions<EventType>
    & Partial<{
        /**
         * Whether to clip the content.
         * @default false
         */
        clipContent: boolean;
        /**
         * Whether to close the path automatically.
         * @default false
         */
        closePath: boolean;
    }>
);
/** dts2md break */
/**
 * Class of shape nodes.
 */
export abstract class ShapeNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * Internal canvas.
     */
    static readonly _canvas = document.createElement('canvas');
    /** dts2md break */
    /**
     * Internal context.
     */
    static readonly _context = ShapeNode._canvas.getContext('2d')!;
    /** dts2md break */
    /**
     * Constructor of `ShapeNode`.
     */
    constructor(options?: ShapeNodeOptions<EventType>) {
        super(options);
        this.clipContent = options?.clipContent ?? false;
        this.closePath = options?.closePath ?? false;
        this.noChildRender = true;
    }
    /** dts2md break */
    /**
     * Whether to clip the content.
     * @default false
     */
    clipContent: boolean;
    /** dts2md break */
    /**
     * Whether to close the path automatically.
     * @default false
     */
    closePath: boolean;
    /** dts2md break */
    /**
     * Illustrates the path of the shape.
     */
    abstract path(context: CanvasRenderingContext2D): void;
    /** dts2md break */
    /**
     * Returns `true` if (x, y) is the path of the shape.
     */
    containsPoint(x: number, y: number) {

        if (!this.bounds.containsPoint(x, y)) {
            return false;
        }

        const { _context } = ShapeNode;

        _context.beginPath();
        this.path(_context);

        return _context.isPointInPath(x - this.x, y - this.y);

    }
    /** dts2md break */
    /**
     * @override CanvasNode.render
     */
    protected renderSelf(renderer: Renderer) {

        const { x, y, computedStyle, closePath, clipContent, childNodes } = this;
        const { context } = renderer;

        context.translate(x, y);

        context.beginPath();
        this.path(context);
        if (closePath) {
            context.closePath();
        }

        if (computedStyle.fillStyle) {
            context.fill();
            context.shadowColor = Utils.Constants.TRANSPARENT;
        }

        context.translate(-x, -y);

        if (clipContent && childNodes.length) {
            context.save();
            context.clip();
            childNodes.forEach(childNode => {
                childNode.render(renderer);
            });
            context.restore();
        }

        if (computedStyle.strokeStyle) {
            context.translate(x, y);
            context.beginPath();
            this.path(context);
            if (closePath) {
                context.closePath();
            }
            context.stroke();
            context.translate(-x, -y);
        }

        if (!clipContent) {
            this.childNodes.forEach(childNode => {
                childNode.render(renderer);
            });
        }

    }

}