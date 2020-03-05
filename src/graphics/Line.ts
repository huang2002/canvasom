import { Shape, ShapeOptions } from './Shape';

export interface LineOptions extends ShapeOptions {
    deltaX: number;
    deltaY: number;
    cross?: boolean;
}
/** dts2md break */
export class Line extends Shape implements Required<LineOptions> {

    /** dts2md break */
    static defaults: Partial<LineOptions> = {
        cross: false,
    };

    /** dts2md break */
    constructor(options: Readonly<LineOptions>) {
        super();
        Object.assign(this, Line.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'line';
    /** dts2md break */
    /**
     * When `cross` is false(default), the line
     * starts at position (x, y) and ends at
     * position (x + deltaX, y + deltaY); If `cross`
     * is set to true, the line will start at
     * position (x + deltaX, y) and ends at
     * position (x, y + deltaY). That is, `\` by
     * default and `/` if cross is set to true.
     */
    deltaX!: number;
    deltaY!: number;
    cross!: boolean;

    /** dts2md break */
    protected _compute() {
        const { bounds } = this;
        bounds.width = this.deltaX;
        bounds.height = this.deltaY;
        this._flexible = !this.clipPath;
    }

    /** dts2md break */
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
