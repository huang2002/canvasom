import { Renderer } from '../core/Renderer';
import { CanvasNode, CanvasNodeEvents, CanvasNodeOptions } from '../core/CanvasNode';

/**
 * Type of image sources of image nodes.
 */
export type ImageNodeSource = Exclude<CanvasImageSource, SVGImageElement>;
/** dts2md break */
/**
 * Type of options of {@link ImageNode}.
 */
export type ImageNodeOptions<Events extends CanvasNodeEvents> = (
    & CanvasNodeOptions<Events>
    & Partial<{
        /**
         * Image source.
         * @default null
         */
        image: ImageNodeSource | null;
        /**
         * Offset x in image source.
         * @default 0
         */
        sourceX: number;
        /**
         * Offset y in image source.
         * @default 0
         */
        sourceY: number;
        /**
         * Image width in source.
         * (`image.width` will be used if this is set to zero.)
         * @default 0
         */
        sourceWidth: number;
        /**
         * Image height in source.
         * (`image.height` will be used if this is set to zero.)
         * @default 0
         */
        sourceHeight: number;
        /**
         * Destination width.
         * (`image.width` will be used if this is set to zero.)
         * @default 0
         */
        destinationWidth: number;
        /**
         * Destination height.
         * (`image.height` will be used if this is set to zero.)
         * @default 0
         */
        destinationHeight: number;
        /**
         * Whether to set `destinationWidth` and `destinationHeight` to
         * `bounds.width` and `bounds.height` on update.
         * (Try this with stretch options!)
         * @default false
         */
        smartSize: boolean;
    }>
);
/** dts2md break */
/**
 * Class of image nodes.
 */
export class ImageNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends CanvasNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link ImageNode}.
     */
    constructor(options?: ImageNodeOptions<Events>) {
        super(options);
        this.image = options?.image ?? null;
        this.sourceX = options?.sourceX ?? 0;
        this.sourceY = options?.sourceY ?? 0;
        this.sourceWidth = options?.sourceWidth ?? 0;
        this.sourceHeight = options?.sourceHeight ?? 0;
        this.destinationWidth = options?.destinationWidth ?? 0;
        this.destinationHeight = options?.destinationHeight ?? 0;
        this.smartSize = options?.smartSize ?? false;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag = 'image';
    /** dts2md break */
    /**
     * Image source.
     * @default null
     */
    image: ImageNodeSource | null;
    /** dts2md break */
    /**
     * Offset x in image source.
     * @default 0
     */
    sourceX: number;
    /** dts2md break */
    /**
     * Offset y in image source.
     * @default 0
     */
    sourceY: number;
    /** dts2md break */
    /**
     * Image width in source.
     * (Default to `image.width`.)
     * @default 0
     */
    sourceWidth: number;
    /** dts2md break */
    /**
     * Image height in source.
     * (Default to `image.height`.)
     * @default 0
     */
    sourceHeight: number;
    /** dts2md break */
    /**
     * Destination width.
     * (Default to `this.sourceWidth`.)
     * @default 0
     */
    destinationWidth: number;
    /** dts2md break */
    /**
     * Destination height.
     * (Default to `this.sourceHeight`.)
     * @default 0
     */
    destinationHeight: number;
    /** dts2md break */
    /**
     * Whether to set `destinationWidth` and `destinationHeight` to
     * `bounds.width` and `bounds.height` on update.
     * (Try this with stretch options!)
     * @default false
     */
    smartSize: boolean;
    /** dts2md break */
    /**
     * @override CanvasNode.beforeUpdate
     */
    protected beforeUpdate(timeStamp: number) {
        const { bounds, image } = this;
        bounds.width = this.destinationWidth || this.sourceWidth || image?.width || 0;
        bounds.height = this.destinationHeight || this.sourceHeight || image?.height || 0;
    }
    /** dts2md break */
    /**
     * @override CanvasNode.renderSelf
     */
    protected renderSelf(renderer: Renderer) {

        const { image } = this;
        if (!image) {
            return;
        }

        const sourceWidth = this.sourceWidth || image.width;
        const sourceHeight = this.sourceHeight || image.height;

        renderer.context.drawImage(
            image,
            this.sourceX,
            this.sourceY,
            sourceWidth,
            sourceHeight,
            this.x,
            this.y,
            this.destinationWidth || sourceWidth,
            this.destinationHeight || sourceHeight,
        );

    }

}
