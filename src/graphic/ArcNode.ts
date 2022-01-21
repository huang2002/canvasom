import { ShapeNode, ShapeNodeOptions } from "./ShapeNode";
import { Utils } from "../common/Utils";
import { CanvasNodeEvents } from '../core/CanvasNode';

/**
 * Type of options of {@link ArcNode}.
 */
export type ArcNodeOptions<Events extends CanvasNodeEvents> = (
    & ShapeNodeOptions<Events>
    & Partial<{
        /**
         * The start angle of the arc. (radian)
         * @default 0
         */
        startAngle: number;
        /**
         * The end angle of the arc. (radian)
         * @default Utils.Constants.TWO_PI
         */
        endAngle: number;
        /**
         * The radius of the arc.
         * @default 0
         */
        radius: number;
        /**
         * Whether the direction is clockwise,
         * from `startAngle` to `endAngle`.
         * @default false
         */
        clockwise: boolean;
    }>
);
/** dts2md break */
/**
 * Class of arc nodes. (or circle nodes)
 */
export class ArcNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends ShapeNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link ArcNode}.
     */
    constructor(options?: ArcNodeOptions<Events>) {
        super(options);
        this.startAngle = options?.startAngle ?? 0;
        this.endAngle = options?.endAngle ?? Utils.Constants.TWO_PI;
        this.radius = options?.radius ?? 0;
        this.clockwise = options?.clockwise ?? false;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag = 'arc';
    /** dts2md break */
    /**
     * The start angle of the arc. (radian)
     * @default 0
     */
    startAngle: number;
    /** dts2md break */
    /**
     * The end angle of the arc. (radian)
     * @default Utils.Constants.TWO_PI
     */
    endAngle: number;
    /** dts2md break */
    /**
     * The radius of the arc.
     * @default 0
     */
    radius: number;
    /** dts2md break */
    /**
     * Whether the direction is clockwise,
     * from `startAngle` to `endAngle`.
     * @default false
     */
    clockwise: boolean;
    /** dts2md break */
    /**
     * @override CanvasNode.beforeUpdate
     */
    protected beforeUpdate(timeStamp: number) {
        const { bounds, radius } = this;
        const size = radius * 2;
        bounds.width = size;
        bounds.height = size;
    }
    /** dts2md break */
    /**
     * @override ShapeNode.path
     */
    path(context: CanvasRenderingContext2D) {
        const { radius } = this;
        context.arc(
            radius, // x
            radius, // y
            radius, // r
            this.startAngle,
            this.endAngle,
            !this.clockwise,
        );
    }

}
