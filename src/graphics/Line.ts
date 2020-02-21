import { Shape, ShapeOptions } from './Shape';

export interface LineOptions extends ShapeOptions {
    deltaX: number;
    deltaY: number;
    cross?: boolean;
}

export class Line extends Shape implements Required<LineOptions> {

    static defaults: Partial<LineOptions> = {
        cross: false,
    };

    constructor(options: Readonly<LineOptions>) {
        super();
        Object.assign(this, Line.defaults, options);
    }

    readonly tag = 'line';
    deltaX!: number;
    deltaY!: number;
    cross!: boolean;

    protected _compute() {
        const { bounds } = this;
        bounds.width = this.deltaX;
        bounds.height = this.deltaY;
        this._flexible = !this.clipPath;
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
