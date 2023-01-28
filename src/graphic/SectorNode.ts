import { ShapeNode, ShapeNodeOptions } from "./ShapeNode";
import { CanvasNodeEvents } from '../core/CanvasNode';
import { registry } from '../common/registry';
import { NodeRecordOptions } from '../utils/createFromRecord';
import { merge } from '3h-utils';

/**
 * Type of options of {@link SectorNode}.
 */
export type SectorNodeOptions<Events extends CanvasNodeEvents> = (
    & ShapeNodeOptions<Events>
    & Partial<{
        /**
         * The start angle of the sector. (radian)
         * @default 0
         */
        startAngle: number;
        /**
         * The end angle of the sector. (radian)
         * @default 0
         */
        endAngle: number;
        /**
         * The radius of the sector.
         * @default 0
         */
        radius: number;
        /**
         * Whether the direction is clockwise,
         * from `startAngle` to `endAngle`.
         * @default false
         */
        clockwise: boolean;
        /**
         * Whether to set `radius` to
         * `Math.min(bounds.width, bounds.height) / 2` on update.
         * (Try this with stretch options!)
         * @default false
         */
        smartSize: boolean;
    }>
);
/** dts2md break */
/**
 * Class of sector nodes.
 */
export class SectorNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends ShapeNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link SectorNode}.
     */
    constructor(options?: SectorNodeOptions<Events>) {
        super(options);
        this.startAngle = options?.startAngle ?? 0;
        this.endAngle = options?.endAngle ?? 0;
        this.radius = options?.radius ?? 0;
        this.smartSize = options?.smartSize ?? false;
        this.clockwise = options?.clockwise ?? false;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'sector';
    /** dts2md break */
    /**
     * The start angle of the sector. (radian)
     * @default 0
     */
    startAngle: number;
    /** dts2md break */
    /**
     * The end angle of the sector. (radian)
     * @default Utils.Constants.TWO_PI
     */
    endAngle: number;
    /** dts2md break */
    /**
     * The radius of the sector.
     * @default 0
     */
    radius: number;
    /** dts2md break */
    /**
     * Whether to set `radius` to
     * `Math.min(bounds.width, bounds.height) / 2` on update.
     * (Try this with stretch options!)
     * @default false
     */
    smartSize: boolean;
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
        const { bounds } = this;
        if (this.smartSize) {
            this.radius = Math.min(bounds.width, bounds.height) / 2;
        } else {
            const size = this.radius * 2;
            bounds.width = size;
            bounds.height = size;
        }
    }
    /** dts2md break */
    /**
     * @override ShapeNode.path
     */
    path(context: CanvasRenderingContext2D) {
        const { radius } = this;
        context.moveTo(radius, radius);
        context.arc(
            radius, // x
            radius, // y
            radius, // r
            this.startAngle,
            this.endAngle,
            !this.clockwise,
        );
        context.lineTo(radius, radius);
    }
    /** dts2md break */
    /**
     * @override ShapeNode.getRecordOptions
     */
    getRecordOptions(): NodeRecordOptions {
        return merge(super.getRecordOptions(), {
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            radius: this.radius,
            clockwise: this.clockwise,
            smartSize: this.smartSize,
        });
    }

}

registry.set('sector', SectorNode);
