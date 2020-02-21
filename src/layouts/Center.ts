import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type CenterDirection = 'x' | 'y' | 'both';

export type CenterOptions = NodeOptions & Partial<{
    direction: CenterDirection;
    width: number;
    height: number;
}>;

export class Center extends Node implements Required<CenterOptions> {

    static defaults: CenterOptions = {
        direction: 'x',
        width: 0,
        height: 0,
    };

    constructor(options?: Readonly<CenterOptions>) {
        super();
        Object.assign(this, Center.defaults, options);
    }

    readonly tag = 'center';
    direction!: CenterDirection;
    width!: number;
    height!: number;
    protected _flexible = true;

    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

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
