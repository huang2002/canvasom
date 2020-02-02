import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export type SectorOptions = ShapeOptions & Partial<{
    startAngle: number;
    endAngle: number;
    radius: number;
    anticlockwise: boolean;
}>;

export class Sector extends Shape implements Required<SectorOptions> {

    static defaults: SectorOptions = {
        startAngle: 0,
        endAngle: Utils.Const.TWO_PI,
        radius: 10,
        anticlockwise: false,
    };

    constructor(options?: Readonly<SectorOptions>) {
        super();
        Object.assign(this, Sector.defaults, options);
    }

    startAngle!: number;
    endAngle!: number;
    radius!: number;
    anticlockwise!: boolean;

    protected _compute() {
        this.bounds.setSize(this.radius * 2);
    }

    path(context: CanvasRenderingContext2D) {
        const { radius } = this;
        context.moveTo(radius, radius);
        context.arc(radius, radius, radius, this.startAngle, this.endAngle, this.anticlockwise);
    }

}
