import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export type ArcOptions = ShapeOptions & Partial<{
    startAngle: number;
    endAngle: number;
    radius: number;
    anticlockwise: boolean;
}>;

export class Arc extends Shape implements Required<ArcOptions> {

    static defaults: ArcOptions = {
        startAngle: 0,
        endAngle: Utils.Const.TWO_PI,
        radius: 10,
        anticlockwise: false,
    };

    constructor(options?: Readonly<ArcOptions>) {
        super();
        Object.assign(this, Arc.defaults, options);
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
        context.arc(radius, radius, radius, this.startAngle, this.endAngle, this.anticlockwise);
    }

}
