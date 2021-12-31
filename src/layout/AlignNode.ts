import { CanvasNode, CanvasNodeEvent, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of align parameter.
 */
export type AlignMode = 'begin' | 'center' | 'end';
/** dts2md break */
/**
 * Type of `AlignNode` options.
 */
export type AlignNodeOptions = CanvasNodeOptions & Partial<{
    /**
     * The width of this node.
     * @default 0
     */
    width: number;
    /**
     * The height of this node.
     * @default 0
     */
    height: number;
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
}>;
/** dts2md break */
/**
 * Class of container nodes that align child nodes.
 */
export class AlignNode<EventType extends CanvasNodeEvent = CanvasNodeEvent>
    extends CanvasNode<EventType> {
    /** dts2md break */
    /**
     * Constructor of `AlignNode`.
     */
    constructor(options?: AlignNodeOptions) {
        super(options);
        this.alignX = options?.alignX ?? 'begin';
        this.alignY = options?.alignY ?? 'begin';
        this.width = options?.width ?? 0;
        this.height = options?.height ?? 0;
    }
    /** dts2md break */
    /**
     * The width of the bounds.
     * @default 0
     */
    width: number;
    /** dts2md break */
    /**
     * The height of the bounds.
     * @default 0
     */
    height: number;
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
     * @override CanvasNode.beforeUpdate
     */
    protected beforeUpdate() {
        const { bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.updateLayout
     */
    protected updateLayout() {

        const { width, height } = this;

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
