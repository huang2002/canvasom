import { Shape, ShapeOptions } from './Shape';

export type LineOptions = ShapeOptions & Partial<{
    width: number;
    height: number;
    cross: boolean;
}>;

export class Line extends Shape implements Required<LineOptions> {

    static defaults: LineOptions = {
        width: 0,
        height: 0,
        cross: false,
    };

    constructor(options?: Readonly<LineOptions>) {
        super();
        Object.assign(this, Line.defaults, options);
    }

    width!: number;
    height!: number;
    cross!: boolean;

    protected _compute() {
        this.bounds.setSize(this.width, this.height);
    }

    path(context: CanvasRenderingContext2D) {
        const { bounds } = this;
        if (this.cross) {
            context.moveTo(bounds.width, 0);
            context.lineTo(0, bounds.height);
        } else {
            context.moveTo(0, 0);
            context.lineTo(bounds.width, bounds.height);
        }
    }

}
