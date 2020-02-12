import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export interface TextOptions extends NodeOptions {
    data: string;
    width?: number;
    height?: number;
    maxWidth?: number;
}

export class Text extends Node implements Required<TextOptions> {

    static defaults: Partial<TextOptions> = {
        width: 0,
        height: 0,
        maxWidth: 1e9
    };

    constructor(options: Readonly<TextOptions>) {
        super();
        Object.assign(this, Text.defaults, options);
    }

    readonly tag = 'text';
    data!: string;
    width!: number;
    height!: number;
    maxWidth!: number;

    protected _compute() {
        const { childNodes, bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        bounds.contain(childNodes);
    }

    protected _render(context: CanvasRenderingContext2D) {
        const { computedStyle, width, height } = this;
        let { left, top } = this;
        switch (computedStyle.textAlign) {
            case 'center': {
                left += width / 2;
                break;
            }
            case 'right': {
                left += width;
                break;
            }
        }
        switch (computedStyle.textBaseline) {
            case 'alphabetic':
            case 'middle': {
                top += height / 2;
                break;
            }
            case 'bottom':
            case 'ideographic': {
                top += height;
                break;
            }
        }
        if (computedStyle.fillStyle) {
            context.fillText(this.data, left, top, this.maxWidth);
            context.shadowColor = Utils.Const.TRANSPARENT;
        }
        if (computedStyle.strokeStyle) {
            context.strokeText(this.data, left, top, this.maxWidth);
        }
        Utils.renderNodes(this.childNodes, context);
    }

}
