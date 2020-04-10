import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type GridOptions = NodeOptions & Partial<{
    rows: number;
    columns: number;
    width: number;
    height: number;
}>;
/** dts2md break */
/**
 * A type of container that aligns its
 * child nodes in a defined grid
 * (the `x/y` properties of each child node
 * will be regarded as the number of the
 * row/column where it should be; row/column
 * numbers start with zero)
 */
export class Grid extends Node implements Required<GridOptions> {

    /** dts2md break */
    static defaults: GridOptions = {
        rows: 1,
        columns: 1,
        width: 0,
        height: 0,
    };

    /** dts2md break */
    constructor(options?: Readonly<GridOptions>) {
        super();
        Object.assign(this, Grid.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'align';
    /** dts2md break */
    /**
     * The number of rows/columns
     */
    rows!: number;
    columns!: number;
    /** dts2md break */
    /**
     * The container size
     */
    width!: number;
    height!: number;
    /** dts2md break */
    protected _flexible = true;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    /** dts2md break */
    align() {
        const { left, top } = this,
            cellWidth = this.width / this.columns,
            cellHeight = this.height / this.rows;
        this.childNodes.forEach(childNode => {
            childNode.left = left + childNode.x * cellWidth;
            childNode.top = top + childNode.y * cellHeight;
        });
    }

    /** dts2md break */
    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
