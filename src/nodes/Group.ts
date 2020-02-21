import { Node } from './Node';
import { Utils } from '../common/Utils';

export class Group extends Node {

    readonly tag = 'group';
    penetrable = true;
    protected _flexible = true;

    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
