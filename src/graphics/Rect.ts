import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export interface RectOptions extends ShapeOptions {
    width: number;
    height: number;
    radius?: number;
}

export class Rect extends Shape implements Required<RectOptions> {

    static defaults: Partial<RectOptions> = {
        radius: 0,
    };

    constructor(options: Readonly<RectOptions>) {
        super();
        Object.assign(this, Rect.defaults, options);
    }

    width!: number;
    height!: number;
    radius!: number;

    protected _compute() {
        this.bounds.setSize(this.width, this.height);
    }

    path(context: CanvasRenderingContext2D) {
        const { width, height, radius } = this;
        if (radius > 0) {
            context.moveTo(radius, 0);
            context.arcTo(width, 0, width, height - radius, radius);
            context.arcTo(width, height, radius, height, radius);
            context.arcTo(0, height, 0, radius, radius);
            context.arcTo(0, 0, radius, 0, radius);
        } else if (radius < 0) {
            const { Const } = Utils,
                _radius = -radius;
            context.moveTo(_radius, 0);
            context.lineTo(width - _radius, 0);
            context.arc(width, 0, _radius, Math.PI, Const.HALF_PI, true);
            context.lineTo(width, height - _radius);
            context.arc(width, height, _radius, Const.THREE_HALVES_PI, Math.PI, true);
            context.lineTo(_radius, height);
            context.arc(0, height, _radius, 0, Const.THREE_HALVES_PI, true);
            context.lineTo(0, _radius);
            context.arc(0, 0, _radius, Const.HALF_PI, Const.TWO_PI, true);
        } else {
            context.rect(0, 0, width, height);
        }
    }

}
