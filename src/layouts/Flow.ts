import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type FlowDirection = 'x' | 'y';

export type FlowOptions = NodeOptions & Partial<{
    direction: FlowDirection;
}>;

export class Flow extends Node implements Required<FlowOptions> {

    static defaults: FlowOptions = {
        direction: 'x',
    };

    constructor(options?: Readonly<FlowOptions>) {
        super();
        Object.assign(this, Flow.defaults, options);
    }

    readonly tag = 'flow';
    direction!: FlowDirection;
    protected _flexible = true;

    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    protected _align() {
        let { left, top } = this;
        if (this.direction === 'x') {
            this.childNodes.forEach(childNode => {
                (childNode.left as number) = (left += childNode.x);
                left += childNode.bounds.width;
            });
        } else {
            this.childNodes.forEach(childNode => {
                (childNode.top as number) = (top += childNode.y);
                top += childNode.bounds.height;
            });
        }
    }

    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
