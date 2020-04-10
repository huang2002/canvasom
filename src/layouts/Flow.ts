import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type FlowDirection = 'x' | 'y';
/** dts2md break */
export type FlowOptions = NodeOptions & Partial<{
    direction: FlowDirection;
}>;
/** dts2md break */
/**
 * A type of container whose child nodes
 * are placed one by one
 */
export class Flow extends Node implements Required<FlowOptions> {

    /** dts2md break */
    static defaults: FlowOptions = {
        direction: 'x',
    };

    /** dts2md break */
    constructor(options?: Readonly<FlowOptions>) {
        super();
        Object.assign(this, Flow.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'flow';
    /** dts2md break */
    /**
     * The direction in which child
     * nodes should be aligned
     */
    direction!: FlowDirection;
    /** dts2md break */
    protected _flexible = true;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    /** dts2md break */
    align() {
        let { left, top } = this;
        if (this.direction === 'x') {
            this.childNodes.forEach(childNode => {
                childNode.left = (left += childNode.x);
                left += childNode.bounds.width;
            });
        } else {
            this.childNodes.forEach(childNode => {
                childNode.top = (top += childNode.y);
                top += childNode.bounds.height;
            });
        }
    }

    /** dts2md break */
    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
