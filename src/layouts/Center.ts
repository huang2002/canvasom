import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type CenterDirection = 'x' | 'y' | 'both';
/** dts2md break */
export type CenterOptions = NodeOptions & Partial<{
    direction: CenterDirection;
    width: number;
    height: number;
}>;
/** dts2md break */
/**
 * A type of container that centers its child nodes
 */
export class Center extends Node implements Required<CenterOptions> {

    /** dts2md break */
    static defaults: CenterOptions = {
        direction: 'x',
        width: 0,
        height: 0,
    };

    /** dts2md break */
    constructor(options?: Readonly<CenterOptions>) {
        super();
        Object.assign(this, Center.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'center';
    /** dts2md break */
    /**
     * The direction in which child
     * nodes should be centered
     */
    direction!: CenterDirection;
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
    protected _align() {
        const { direction, childNodes, left, top, width, height } = this,
            alignX = direction === 'x' || direction === 'both',
            alignY = direction === 'y' || direction === 'both';
        childNodes.forEach(childNode => {
            const { bounds } = childNode;
            if (alignX) {
                (childNode.left as number) = left
                    + (width - bounds.width) / 2
                    + childNode.x;
            }
            if (alignY) {
                (childNode.top as number) = top
                    + (height - bounds.height) / 2
                    + childNode.y;
            }
        });
    }

    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }


}
