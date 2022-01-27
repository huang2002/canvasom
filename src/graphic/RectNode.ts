import { ShapeNode, ShapeNodeOptions } from "./ShapeNode";
import { Utils } from "../common/Utils";
import { CanvasNodeEvents } from '../core/CanvasNode';

/**
 * Type of options of {@link RectNode}.
 */
export type RectNodeOptions<Events extends CanvasNodeEvents> = (
    & ShapeNodeOptions<Events>
    & Partial<{
        /**
         * The width of the rectangle.
         * @default 0
         */
        width: number;
        /**
         * The height of the rectangle.
         * @default 0
         */
        height: number;
        /**
         * The radius of the corners.
         * (Try negative value!)
         * @default 0
         */
        radius: number;
        /**
         * Whether to set `width` and `height` to
         * `bounds.width` and `bounds.height` on update.
         * (Try this with stretch options!)
         * @default false
         */
        smartSize: boolean;
    }>
);
/** dts2md break */
/**
 * Class of rectangle nodes.
 */
export class RectNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends ShapeNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link RectNode}.
     */
    constructor(options?: RectNodeOptions<Events>) {
        super(options);
        this.width = options?.width ?? 0;
        this.height = options?.height ?? 0;
        this.radius = options?.radius ?? 0;
        this.smartSize = options?.smartSize ?? false;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'rect';
    /** dts2md break */
    /**
     * The width of the rectangle.
     */
    width: number;
    /** dts2md break */
    /**
     * The height of the rectangle.
     */
    height: number;
    /** dts2md break */
    /**
     * The radius of the corners.
     * (Try negative value!)
     * @default 0
     */
    radius: number;
    /** dts2md break */
    /**
     * Whether to set `width` and `height` to
     * `bounds.width` and `bounds.height` on update.
     * (Try this with stretch options!)
     * @default false
     */
    smartSize: boolean;
    /** dts2md break */
    /**
     * @override CanvasNode.beforeUpdate
     */
    protected beforeUpdate(timeStamp: number) {
        const { bounds } = this;
        if (this.smartSize) {
            this.width = bounds.width;
            this.height = bounds.height;
        } else {
            bounds.width = this.width;
            bounds.height = this.height;
        }
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
