import { Shape, ShapeOptions } from './Shape';

export interface LineOptions extends ShapeOptions {
    width: number;
    height: number;
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

    width!: number;
    height!: number;
    cross!: boolean;

    protected _compute() {
        const { childNodes } = this;
        this.bounds.setSize(this.width, this.height);
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        this.bounds.contain(childNodes);
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
