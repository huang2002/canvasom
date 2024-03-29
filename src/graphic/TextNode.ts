import { Utils } from '../common/Utils';
import { Style } from '../common/Style';
import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions } from '../core/CanvasNode';
import type { Renderer } from '../core/Renderer';
import { registry } from '../common/registry';
import { merge } from '3h-utils';
import { NodeRecordOptions } from '../utils/createFromRecord';

/**
 * Type of options of {@link TextNode}.
 */
export type TextNodeOptions<Events extends CanvasNodeEvents> = (
    & CanvasNodeOptions<Events>
    & Partial<{
        /**
         * The text content.
         * @default ''
         */
        content: string;
        /**
         * Whether the text should be rendered
         * from left to right.
         * (This only affects text align.)
         * @default true
         */
        ltr: boolean;
    }>
);
/** dts2md break */
/**
 * Class of text nodes.
 */
export class TextNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends CanvasNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link TextNode}.
     */
    constructor(options?: TextNodeOptions<Events>) {
        super(options);
        this.content = options?.content ?? '';
        this.ltr = options?.ltr ?? true;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'text';
    /** dts2md break */
    /**
     * The text content.
     * @default ''
     */
    content: string;
    /** dts2md break */
    /**
     * Whether the text should be rendered
     * from left to right.
     * (This only affects text align.)
     * @default true
     */
    ltr: boolean;
    /** dts2md break */
    /**
     * @override CanvasNode.renderSelf
     */
    protected renderSelf(renderer: Renderer) {

        const { computedStyle } = this;
        if (!computedStyle.fillStyle && !computedStyle.strokeStyle) {
            return;
        }

        const { context } = renderer;
        Style.applyText(computedStyle, context);

        const { content, bounds: { width, height }, ltr } = this;
        let { position: { x, y } } = this;

        // adjust x
        const { textAlign } = computedStyle;
        if (textAlign === 'center') {
            x += width / 2;
        } else if (
            (textAlign === 'right')
            || (ltr ? (textAlign === 'end') : (textAlign === 'start'))
        ) {
            x += width;
        }

        // adjust y
        const { textBaseline } = computedStyle;
        if (textBaseline === 'middle') {
            y += height / 2;
        } else if (
            (textBaseline === 'bottom')
            || (textBaseline === 'alphabetic')
        ) {
            y += height;
        }

        if (computedStyle.fillStyle) {
            context.fillText(content, x, y);
            context.shadowColor = Utils.Constants.TRANSPARENT;
        }

        if (computedStyle.strokeStyle) {
            context.strokeText(content, x, y);
        }

    }
    /** dts2md break */
    /**
     * @override ShapeNode.getRecordOptions
     */
    getRecordOptions(): NodeRecordOptions {
        return merge(super.getRecordOptions(), {
            content: this.content,
            ltr: this.ltr,
        });
    }

}

registry.set('text', TextNode);
