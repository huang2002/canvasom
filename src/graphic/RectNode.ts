import { ShapeNode, ShapeNodeOptions } from "./ShapeNode";
import { Utils } from "../common/Utils";
import { CanvasNodeEvent } from '../core/CanvasNode';

/**
 * Type of `RectNode` options.
 */
export interface RectNodeOptions<EventType extends CanvasNodeEvent>
    extends ShapeNodeOptions<EventType> {
    /**
     * The width of the rectangle.
     */
    width: number;
    /**
     * The height of the rectangle.
     */
    height: number;
    /**
     * The radius of the corners.
     * (Try negative value!)
     * @default 0
     */
    radius?: number;
}
/** dts2md break */
/**
 * Class of rectangle nodes.
 */
export class RectNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends ShapeNode<EventType> {
    /** dts2md break */
    /**
     * Constructor of `RectNode`.
     */
    constructor(options: RectNodeOptions<EventType>) {
        super(options);
        this.width = options.width;
        this.height = options.height;
        this.radius = options.radius ?? 0;
    }
    /** dts2md break */
    /**
     * The width of the rectangle.
     */
    width: number;
    /**
     * The height of the rectangle.
     */
    /** dts2md break */
    height: number;
    /**
     * The radius of the corners.
     * (Try negative value!)
     * @default 0
     */
    /** dts2md break */
    radius: number;
    /** dts2md break */
    /**
     * @override CanvasNode.update
     */
    protected beforeUpdate() {
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
    }
    /** dts2md break */
    /**
     * @override ShapeNode.path
     */
    path(context: CanvasRenderingContext2D) {
        const { width, height, radius } = this;
        if (radius > 0) {
            context.moveTo(radius, 0);
            context.arcTo(width, 0, width, height - radius, radius);
            context.arcTo(width, height, radius, height, radius);
            context.arcTo(0, height, 0, radius, radius);
            context.arcTo(0, 0, radius, 0, radius);
        } else if (radius < 0) {
            const { HALF_PI, PI, THREE_HALVES_PI, TWO_PI } = Utils.Constants;
            const _radius = -radius;
            context.moveTo(_radius, 0);
            context.lineTo(width - _radius, 0);
            context.arc(width, 0, _radius, PI, HALF_PI, true);
            context.lineTo(width, height - _radius);
            context.arc(width, height, _radius, THREE_HALVES_PI, PI, true);
            context.lineTo(_radius, height);
            context.arc(0, height, _radius, 0, THREE_HALVES_PI, true);
            context.lineTo(0, _radius);
            context.arc(0, 0, _radius, HALF_PI, TWO_PI, true);
        } else {
            context.rect(0, 0, width, height);
        }
    }

}