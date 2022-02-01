import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of align parameter.
 */
export type AlignMode = 'begin' | 'center' | 'end';
/** dts2md break */
/**
 * Type of options of {@link AlignNode}.
 */
export type AlignNodeOptions<Events extends CanvasNodeEvents> = (
    & CanvasNodeOptions<Events>
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
        /** dts2md break */
        /**
         * @override CanvasNode.penetrable
         * @default true
         */
        penetrable: boolean;
    }>
);
/** dts2md break */
/**
 * Class of container nodes that align child nodes.
 */
export class AlignNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends CanvasNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link AlignNode}.
     */
    constructor(options?: AlignNodeOptions<Events>) {
        super(options);
        this.alignX = options?.alignX ?? 'begin';
        this.alignY = options?.alignY ?? 'begin';
        this.penetrable = options?.penetrable ?? true;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'align';
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
    penetrable: boolean;
    /** dts2md break */
    /**
     * @override CanvasNode.updateLayout
     */
    protected updateLayout(timeStamp: number) {

        const { width, height } = this.bounds;

        switch (this.alignX) {
            case 'begin': {
                break;
            }
            case 'center': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    childNode.layoutOffsetX = (width - childBounds.width) / 2;
                });
                break;
            }
            case 'end': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    childNode.layoutOffsetX = width - childBounds.width;
                });
                break;
            }
            default: {
                throw new TypeError('unknown alignX');
            }
        }

        switch (this.alignY) {
            case 'begin': {
                break;
            }
            case 'center': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    childNode.layoutOffsetY = (height - childBounds.height) / 2;
                });
                break;
            }
            case 'end': {
                this.childNodes.forEach(childNode => {
                    const { bounds: childBounds } = childNode;
                    childNode.layoutOffsetY = height - childBounds.height;
                });
                break;
            }
            default: {
                throw new TypeError('unknown alignY');
            }
        }

    }

}
