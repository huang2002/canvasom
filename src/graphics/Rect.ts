import { Shape, ShapeOptions } from './Shape';
import { Utils } from '../common/Utils';

export interface RectOptions extends ShapeOptions {
    width: number;
    height: number;
    radius?: number;
}
/** dts2md break */
export class Rect extends Shape implements Required<RectOptions> {

    /** dts2md break */
    static defaults: Partial<RectOptions> = {
        radius: 0,
    };

    /** dts2md break */
    constructor(options: Readonly<RectOptions>) {
        super();
        Object.assign(this, Rect.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'rect';
    /** dts2md break */
    width!: number;
    height!: number;
    /** dts2md break */
    /**
     * The corner radius
     * (negative radius results in concave corners)
     */
    radius!: number;

    /** dts2md break */
    protected _compute() {
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
        this._flexible = !this.clipPath;
    }

    /** dts2md break */
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
