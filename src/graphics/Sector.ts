import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export interface SectorOptions extends ShapeOptions {
    startAngle?: number;
    endAngle?: number;
    radius: number;
    anticlockwise?: boolean;
}
/** dts2md break */
export class Sector extends Shape implements Required<SectorOptions> {

    /** dts2md break */
    static defaults: Partial<SectorOptions> = {
        startAngle: 0,
        endAngle: Utils.Const.TWO_PI,
        anticlockwise: false,
    };

    /** dts2md break */
    constructor(options: Readonly<SectorOptions>) {
        super();
        Object.assign(this, Sector.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'sector';
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
        context.moveTo(radius, radius);
        context.arc(radius, radius, radius, this.startAngle, this.endAngle, this.anticlockwise);
    }


}
