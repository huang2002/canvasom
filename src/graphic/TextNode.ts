import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions } from '../core/CanvasNode';
import type { Renderer } from '../core/Renderer';

/**
 * Type of options of {@link TextNode}.
 */
export type TextNodeOptions<EventType extends CanvasNodeEvent> = (
    & CanvasNodeOptions<EventType>
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
export class TextNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * Constructor of {@link TextNode}.
     */
    constructor(options?: TextNodeOptions<EventType>) {
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
        if (computedStyle.fillStyle) {
            context.fillText(content, x, y);
        }
        if (computedStyle.strokeStyle) {
            context.strokeText(content, x, y);
        }
    }

}
