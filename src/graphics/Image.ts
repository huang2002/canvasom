import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type Texture =
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | ImageBitmap
    | OffscreenCanvas;
/** dts2md break */
export type ImageOptions = NodeOptions & Partial<{
    texture: Texture | null;
    width: number;
    height: number;
    srcX: number;
    srcY: number;
    srcWidth: number;
    srcHeight: number;
}>;
/** dts2md break */
export class Image extends Node implements Required<ImageOptions> {

    /** dts2md break */
    static defaults: ImageOptions = {
        texture: null,
        width: 0,
        height: 0,
        srcX: 0,
        srcY: 0,
        srcWidth: 0,
        srcHeight: 0
    };

    /** dts2md break */
    constructor(options?: Readonly<ImageOptions>) {
        super();
        Object.assign(this, Image.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'image';
    /** dts2md break */
    /**
     * Computed destination size
     */
    readonly dstWidth: number = 0;
    readonly dstHeight: number = 0;
    /** dts2md break */
    texture!: Texture | null;
    /** dts2md break */
    /**
     * If set zero(default), use the source size as the destination size
     */
    width!: number;
    height!: number;
    /** dts2md break */
    /**
     * Source position/size
     */
    srcX!: number;
    srcY!: number;
    srcWidth!: number;
    srcHeight!: number;
    /** dts2md break */
    protected _flexible = true;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    /** dts2md break */
    protected _compute() {
        const { texture } = this;
        if (!texture) {
            return;
        }
        if (!this.srcWidth) {
            this.srcWidth = texture.width;
        }
        if (!this.srcHeight) {
            this.srcHeight = texture.height;
        }
        (this.dstWidth as number) = this.width || this.srcWidth;
        (this.dstHeight as number) = this.height || this.srcHeight;
        const { bounds } = this;
        bounds.width = this.dstWidth;
        bounds.height = this.dstHeight;
    }

    protected _render(context: CanvasRenderingContext2D) {
        const { texture } = this;
        if (!texture) {
            return;
        }
        const { computedStyle, left, top, dstWidth, dstHeight } = this;
        if (computedStyle.fillStyle) {
            context.fillRect(left, top, dstWidth, dstHeight);
            context.shadowColor = Utils.Const.TRANSPARENT;
        }
        context.drawImage(
            texture,
            this.srcX,
            this.srcY,
            this.srcWidth,
            this.srcHeight,
            left,
            top,
            dstWidth,
            dstHeight
        );
        if (computedStyle.strokeStyle) {
            context.strokeRect(left, top, dstWidth, dstHeight);
        }
        Utils.renderNodes(this.childNodes, context);
    }

}
