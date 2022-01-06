import { Style } from '../common/Style';
import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions } from '../core/CanvasNode';
import type { Renderer } from '../core/Renderer';

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
    }
    /** dts2md break */
    /**
     * The text content.
     * @default ''
     */
    content: string;
    /** dts2md break */
    /**
     * @override CanvasNode.renderSelf
     */
    protected renderSelf(renderer: Renderer) {

        const { context } = renderer;
        const { computedStyle, content, x, y } = this;

        if (!computedStyle.fillStyle && !computedStyle.strokeStyle) {
            return;
        }

        Style.applyText(computedStyle, context);

        if (computedStyle.fillStyle) {
            context.fillText(content, x, y);
        }

        if (computedStyle.strokeStyle) {
            context.strokeText(content, x, y);
        }

    }

}
