import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export interface TextOptions extends NodeOptions {
    data: string;
    width?: number;
    height?: number;
    maxWidth?: number;
}
/** dts2md break */
export class Text extends Node implements Required<TextOptions> {

    /** dts2md break */
    static defaults: Partial<TextOptions> = {
        width: 0,
        height: 0,
        maxWidth: 1e9
    };

    /** dts2md break */
    constructor(options: Readonly<TextOptions>) {
        super();
        Object.assign(this, Text.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'text';
    /** dts2md break */
    /**
     * The text content
     */
    data!: string;
    /** dts2md break */
    /**
     * The bounds size of the text
     * (may affect text rendering position based
     * on `style.textAlign` and `style.textBaseline`)
     * @default 0
     */
    width!: number;
    height!: number;
    /** dts2md break */
    /**
     * The maximum width of the text
     * @defaults A very large number
     */
    maxWidth!: number;
    /** dts2md break */
    protected _flexible = true;

    /** dts2md break */
    protected _compute() {
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
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
