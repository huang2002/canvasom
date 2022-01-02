import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of flow direction.
 */
export type FlowDirection = 'x' | 'y';
/** dts2md break */
/**
 * Type of options of {@link FlowNode}.
 */
export type FlowNodeOptions<EventType extends CanvasNodeEvent> = (
    & CanvasNodeOptions<EventType>
    & Partial<{
        /**
         * Flow direction.
         * @default 'x'
         */
        direction: FlowDirection;
        /**
         * Gap between child nodes.
         * @default 0
         */
        gap: number;
    }>
);
/** dts2md break */
/**
 * Class of container nodes that make child nodes align like flows.
 */
export class FlowNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * Constructor of {@link FlowNode}.
     */
    constructor(options?: FlowNodeOptions<EventType>) {
        super(options);
        this.direction = options?.direction ?? 'x';
        this.gap = options?.gap ?? 0;
    }
    /** dts2md break */
    /**
     * Flow direction.
     * @default 'x'
     */
    direction: FlowDirection;
    /** dts2md break */
    /**
     * Gap between child nodes.
     * @default 0
     */
    gap: number;
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

        const { childNodes, gap } = this;

        switch (this.direction) {

            case 'x': {
                let dx = 0;
                childNodes.forEach(childNode => {
                    // narrow the type to access protected properties
                    (childNode as FlowNode).layoutOffsetX = dx;
                    dx += childNode.bounds.width + gap;
                });
                break;
            }

            case 'y': {
                let dy = 0;
                childNodes.forEach(childNode => {
                    // narrow the type to access protected properties
                    (childNode as FlowNode).layoutOffsetY = dy;
                    dy += childNode.bounds.height + gap;
                });
                break;
            }

            default: {
                throw new TypeError('unknown flow direction');
            }

        }

    }

}
