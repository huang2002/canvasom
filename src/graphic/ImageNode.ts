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
    }
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
     * (`image.width` will be used if this is set to zero.)
     * @default 0
     */
    sourceWidth: number;
    /** dts2md break */
    /**
     * Image height in source.
     * (`image.height` will be used if this is set to zero.)
     * @default 0
     */
    sourceHeight: number;
    /** dts2md break */
    /**
     * Destination width.
     * (`image.width` will be used if this is set to zero.)
     * @default 0
     */
    destinationWidth: number;
    /** dts2md break */
    /**
     * Destination height.
     * (`image.height` will be used if this is set to zero.)
     * @default 0
     */
    destinationHeight: number;
    /** dts2md break */
    /**
     * @override CanvasNode.beforeUpdate
     */
    protected beforeUpdate(timeStamp: number) {
        const { bounds, image } = this;
        bounds.width = this.destinationWidth || image?.width || 0;
        bounds.height = this.destinationHeight || image?.height || 0;
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

        const { context } = renderer;
        context.drawImage(
            image,
            this.sourceX,
            this.sourceY,
            this.sourceWidth || image.width,
            this.sourceHeight || image.height,
            this.x,
            this.y,
            this.destinationWidth || image.width,
            this.destinationHeight || image.height,
        );

    }

}
