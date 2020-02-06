import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export interface SectorOptions extends ShapeOptions {
    startAngle?: number;
    endAngle?: number;
    radius: number;
    anticlockwise?: boolean;
}

export class Sector extends Shape implements Required<SectorOptions> {

    static defaults: Partial<SectorOptions> = {
        startAngle: 0,
        endAngle: Utils.Const.TWO_PI,
        anticlockwise: false,
    };

    constructor(options: Readonly<SectorOptions>) {
        super();
        Object.assign(this, Sector.defaults, options);
    }

    readonly tag = 'sector';
    startAngle!: number;
    endAngle!: number;
    radius!: number;
    anticlockwise!: boolean;

    protected _compute() {
        const { childNodes } = this;
        this.bounds.setSize(this.radius * 2);
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        this.bounds.contain(childNodes);
    }

    path(context: CanvasRenderingContext2D) {
        const { radius } = this;
        context.moveTo(radius, radius);
        context.arc(radius, radius, radius, this.startAngle, this.endAngle, this.anticlockwise);
    }

}
