import { Node } from './Node';
import { Utils } from '../common/Utils';

/**
 * A utility node type that can be
 * used to group a set of nodes
 */
export class Group extends Node {

    /** dts2md break */
    readonly tag = 'group';
    protected _flexible = true;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    /** dts2md break */
    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
