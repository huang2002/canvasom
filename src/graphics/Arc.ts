import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export interface ArcOptions extends ShapeOptions {
    startAngle?: number;
    endAngle?: number;
    radius: number;
    anticlockwise?: boolean;
}

export class Arc extends Shape implements Required<ArcOptions> {

    static defaults: Partial<ArcOptions> = {
        startAngle: 0,
        endAngle: Utils.Const.TWO_PI,
        anticlockwise: false,
    };

    constructor(options: Readonly<ArcOptions>) {
        super();
        Object.assign(this, Arc.defaults, options);
    }

    readonly tag = 'arc';
    startAngle!: number;
    endAngle!: number;
    radius!: number;
    anticlockwise!: boolean;

    protected _compute() {
        const { childNodes, bounds } = this;
        bounds.width = bounds.height = this.radius * 2;
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        if (!this.clipPath) {
            this.bounds.contain(childNodes);
        }
    }

    path(context: CanvasRenderingContext2D) {
        const { radius } = this;
        context.arc(radius, radius, radius, this.startAngle, this.endAngle, this.anticlockwise);
    }

}
