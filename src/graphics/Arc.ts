import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export interface ArcOptions extends ShapeOptions {
    startAngle?: number;
    endAngle?: number;
    radius: number;
    anticlockwise?: boolean;
}
/** dts2md break */
export class Arc extends Shape implements Required<ArcOptions> {

    /** dts2md break */
    static defaults: Partial<ArcOptions> = {
        startAngle: 0,
        endAngle: Utils.Const.TWO_PI,
        anticlockwise: false,
    };

    /** dts2md break */
    constructor(options: Readonly<ArcOptions>) {
        super();
        Object.assign(this, Arc.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'arc';
    /** dts2md break */
    startAngle!: number;
    endAngle!: number;
    radius!: number;
    /** dts2md break */
    /**
     * @default false
     */
    anticlockwise!: boolean;

    /** dts2md break */
    protected _compute() {
        const { bounds } = this;
        bounds.width = bounds.height = this.radius * 2;
        this._flexible = !this.clipPath;
    }

    /** dts2md break */
    path(context: CanvasRenderingContext2D) {
        const { radius } = this;
        context.arc(radius, radius, radius, this.startAngle, this.endAngle, this.anticlockwise);
    }


}
