import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of flow direction.
 */
export type FlowDirection = 'x' | 'y';
/** dts2md break */
/**
 * Type of options of {@link FlowNode}.
 */
export type FlowNodeOptions<Events extends CanvasNodeEvents> = (
    & CanvasNodeOptions<Events>
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
        /** dts2md break */
        /**
         * @override CanvasNodeOptions.penetrable
         * @default true
         */
        penetrable: boolean;
    }>
);
/** dts2md break */
/**
 * Class of container nodes that make child nodes align like flows.
 */
export class FlowNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends CanvasNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link FlowNode}.
     */
    constructor(options?: FlowNodeOptions<Events>) {
        super(options);
        this.direction = options?.direction ?? 'x';
        this.gap = options?.gap ?? 0;
        this.penetrable = options?.penetrable ?? true;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'flow';
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
    penetrable: boolean;
    /** dts2md break */
    /**
     * @override CanvasNode.updateLayout
     */
    protected updateLayout(timeStamp: number) {

        const { childNodes, gap } = this;

        switch (this.direction) {

            case 'x': {
                let dx = 0;
                childNodes.forEach(childNode => {
                    childNode.layoutOffsetX = dx;
                    dx += childNode.bounds.width + gap;
                });
                break;
            }

            case 'y': {
                let dy = 0;
                childNodes.forEach(childNode => {
                    childNode.layoutOffsetY = dy;
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
