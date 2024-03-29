import { Renderer } from '../core/Renderer';
import { Utils } from '../common/Utils';
import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions } from '../core/CanvasNode';
import { NodeRecordOptions } from '../utils/createFromRecord';
import { merge } from '3h-utils';

/**
 * Type of options of {@link ShapeNode}.
 */
export type ShapeNodeOptions<Events extends CanvasNodeEvents> = (
    & CanvasNodeOptions<Events>
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
export abstract class ShapeNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends CanvasNode<Events> {
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
     * Constructor of {@link ShapeNode}.
     */
    constructor(options?: ShapeNodeOptions<Events>) {
        super(options);
        this.clipContent = options?.clipContent ?? false;
        this.closePath = options?.closePath ?? false;
        this.noChildRender = true;
    }
    /** dts2md break */
    /**
     * Whether to clip the content to the path.
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
     * (Relative to `this.position`.)
     */
    abstract path(context: CanvasRenderingContext2D): void;
    /** dts2md break */
    /**
     * Returns `true` if (x, y) is in the path of the shape.
     * (Relative to `this.position`.)
     * @override CanvasNode.containsPoint
     */
    containsPoint(x: number, y: number) {

        if (!this.bounds.containsPoint(x, y)) {
            return false;
        }

        const { _context } = ShapeNode;
        const { position } = this;

        _context.beginPath();
        this.path(_context);

        return _context.isPointInPath(
            x - position.x,
            y - position.y,
        );

    }
    /** dts2md break */
    /**
     * @override CanvasNode.renderSelf
     */
    protected renderSelf(renderer: Renderer) {

        const { position, computedStyle, closePath, clipContent, childNodes } = this;
        const { context } = renderer;

        context.translate(position.x, position.y);

        context.beginPath();
        this.path(context);
        if (closePath) {
            context.closePath();
        }

        if (computedStyle.fillStyle) {
            context.fill();
            context.shadowColor = Utils.Constants.TRANSPARENT;
        }

        context.translate(-position.x, -position.y);

        if (clipContent && childNodes.length) {
            context.save();
            context.clip();
            childNodes.forEach(childNode => {
                childNode.renderSync(renderer);
            });
            context.restore();
        }

        if (computedStyle.strokeStyle) {
            context.translate(position.x, position.y);
            context.beginPath();
            this.path(context);
            if (closePath) {
                context.closePath();
            }
            context.stroke();
            context.translate(-position.x, -position.y);
        }

        if (!clipContent) {
            this.childNodes.forEach(childNode => {
                childNode.renderSync(renderer);
            });
        }

    }
    /** dts2md break */
    /**
     * @override CanvasNode.getRecordOptions
     */
    getRecordOptions(): NodeRecordOptions {
        return merge(super.getRecordOptions(), {
            clipContent: this.clipContent,
            closePath: this.closePath,
        });
    }

}
