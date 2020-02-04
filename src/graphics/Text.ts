import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export interface TextOptions extends NodeOptions {
    data: string;
}

export class Text extends Node implements Required<TextOptions> {

    static defaults: Partial<TextOptions> = {};

    constructor(options: Readonly<TextOptions>) {
        super();
        Object.assign(this, Text.defaults, options);
    }

    data!: string;

    protected _render(context: CanvasRenderingContext2D) {
        const { computedStyle } = this;
        if (computedStyle.fillStyle) {
            context.fillText(this.data, 0, 0);
            context.shadowColor = Utils.Const.TRANSPARENT;
        }
        if (computedStyle.strokeStyle) {
            context.strokeText(this.data, 0, 0);
        }
        Utils.renderNodes(this.childNodes, context);
    }

}
