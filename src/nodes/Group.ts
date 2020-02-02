import { Node } from './Node';
import { Utils } from '../common/Utils';

export class Group extends Node {

    penetrable = true;

    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
