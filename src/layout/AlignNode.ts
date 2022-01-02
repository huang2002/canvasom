import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of align parameter.
 */
export type AlignMode = 'begin' | 'center' | 'end';
/** dts2md break */
/**
 * Type of options of {@link AlignNode}.
 */
export type AlignNodeOptions<EventType extends CanvasNodeEvent> = (
    & CanvasNodeOptions<EventType>
    & Partial<{
        /**
         * Horizontal align.
         * @default 'begin'
         */
        alignX: AlignMode;
        /**
         * Vertical align.
         * @default 'begin'
         */
        alignY: AlignMode;
    }>
);
/** dts2md break */
/**
 * Class of container nodes that align child nodes.
 */
export class AlignNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * Constructor of {@link AlignNode}.
     */
    constructor(options?: AlignNodeOptions<EventType>) {
        super(options);
        this.alignX = options?.alignX ?? 'begin';
        this.alignY = options?.alignY ?? 'begin';
    }
    /** dts2md break */
    /**
     * Horizontal align.
     * @default 'begin'
     */
    alignX: AlignMode;
    /** dts2md break */
    /**
     * Vertical align.
     * @default 'begin'
     */
    alignY: AlignMode;
    /** dts2md break */
    /**
     * @override CanvasNode.penetrable
     * @default true
     */
    penetrable = true;
    /** dts2md break */
    /**
     * @override CanvasNode.updateLayout
     */
    protected updateLayout() {

        const { width, height } = this.bounds;

        switch (this.alignX) {
            case 'begin': {
                break;
            }
            case 'center': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    // narrow the type to access protected properties
                    (childNode as AlignNode).layoutOffsetX =
                        (width - childBounds.width) / 2;
                });
                break;
            }
            case 'end': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    // narrow the type to access protected properties
                    (childNode as AlignNode).layoutOffsetX =
                        (width - childBounds.width);
                });
                break;
            }
            default: {
                throw new Error('unknown alignX');
            }
        }

        switch (this.alignY) {
            case 'begin': {
                break;
            }
            case 'center': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    // narrow the type to access protected properties
                    (childNode as AlignNode).layoutOffsetY =
                        (height - childBounds.height) / 2;
                });
                break;
            }
            case 'end': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    // narrow the type to access protected properties
                    (childNode as AlignNode).layoutOffsetY =
                        (height - childBounds.height);
                });
                break;
            }
            default: {
                throw new Error('unknown alignY');
            }
        }

    }

}
