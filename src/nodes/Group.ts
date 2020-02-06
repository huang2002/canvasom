import { Node } from './Node';
import { Utils } from '../common/Utils';

export class Group extends Node {

    penetrable = true;

    protected _compute() {
        const { childNodes } = this;
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        this.bounds.contain(childNodes);
    }

    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
