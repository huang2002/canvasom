import { Utils } from "./Utils";

/**
 * The type of canvas style properties.
 */
export interface CanvasStyle {
    /**
     * @default null
     */
    fillStyle: null | string | CanvasGradient | CanvasPattern;
    /**
     * @default null
     */
    strokeStyle: null | string | CanvasGradient | CanvasPattern;
    /**
     * @default 1
     */
    lineWidth: number;
    /**
     * @default 'butt'
     */
    lineCap: CanvasLineCap;
    /**
     * @default 'miter'
     */
    lineJoin: CanvasLineJoin;
    /**
     * @default 0
     */
    lineDashOffset: number;
    /**
     * @default null
     */
    lineDash: null | number[];
    /**
     * @default 10
     */
    miterLimit: number;
    /**
     * @default 'inherit'
     */
    direction: CanvasDirection;
    /**
     * @default '18px sans-serif'
     */
    font: string;
    /**
     * @default 'left'
     */
    textAlign: CanvasTextAlign;
    /**
     * @default 'top'
     */
    textBaseline: CanvasTextBaseline;
    /**
     * @default null
     */
    shadowColor: null | string;
    /**
     * @default 0
     */
    shadowBlur: number;
    /**
     * @default 0
     */
    shadowOffsetX: number;
    /**
     * @default 0
     */
    shadowOffsetY: number;
    /**
     * @default 1
     */
    opacity: number;
    /**
     * @default 'source-over'
     */
    compositeOperation: string;
    /**
     * Pixel ratio
     * @default window.devicePixelRatio
     */
    ratio: number;
    /**
     * When this is set, the bounds of the node will be rendered.
     * (useful for debugging)
     * @default null
     */
    boundsStyle: null | string | CanvasGradient | CanvasPattern;
    /**
     * @default 1
     */
    boundsWidth: number;
    /**
     * @default 'miter'
     */
    boundsJoin: CanvasLineJoin;
    /**
     * @default 0
     */
    boundsDashOffset: number;
    /**
     * @default null
     */
    boundsDash: null | number[];
    /**
     * @default .8
     */
    boundsOpacity: number;
}
/** dts2md break */
/**
 * Style-related APIs.
 */
export namespace Style {
    /** dts2md break */
    /**
     * The defaults of canvas style properties.
     * (This is mutable.)
     */
    export const defaults: CanvasStyle = {

        fillStyle: null,
        strokeStyle: null,
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        lineDashOffset: 0,
        lineDash: null,

        font: '18px sans-serif',
        direction: 'inherit',
        textAlign: 'left',
        textBaseline: 'top',

        shadowColor: null,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,

        opacity: 1,
        compositeOperation: 'source-over',
        ratio: window.devicePixelRatio || 1,

        boundsStyle: null,
        boundsWidth: 1,
        boundsJoin: 'miter',
        boundsDashOffset: 0,
        boundsDash: null,
        boundsOpacity: .8,

    };
    /** dts2md break */
    /**
     * Apply style properties to canvas context.
     * (Use `Style.applyBounds` to apply bounds styles.)
     */
    export const apply = (
        style: CanvasStyle,
        context: CanvasRenderingContext2D,
    ) => {
        if (style.fillStyle) {
            context.fillStyle = style.fillStyle;
        }
        if (style.strokeStyle) {
            context.strokeStyle = style.strokeStyle;
            context.lineWidth = style.lineWidth;
            context.lineCap = style.lineCap;
            context.lineJoin = style.lineJoin;
            context.miterLimit = style.miterLimit;
            if (style.lineDash) {
                context.setLineDash(style.lineDash);
                context.lineDashOffset = style.lineDashOffset;
            } else {
                context.setLineDash([]);
            }
        }
        context.font = style.font;
        context.direction = style.direction;
        context.textAlign = style.textAlign;
        context.textBaseline = style.textBaseline;
        if (style.shadowColor) {
            const { ratio } = style;
            context.shadowColor = style.shadowColor;
            context.shadowBlur = style.shadowBlur * ratio;
            context.shadowOffsetX = style.shadowOffsetX * ratio;
            context.shadowOffsetY = style.shadowOffsetY * ratio;
        } else {
            context.shadowColor = Utils.Constants.TRANSPARENT;
        }
        context.globalAlpha = style.opacity;
        context.globalCompositeOperation = style.compositeOperation;
    };
    /** dts2md break */
    /**
     * Apply bounds style properties to canvas context.
     */
    export const applyBounds = (
        style: CanvasStyle,
        context: CanvasRenderingContext2D,
    ) => {
        if (!style.boundsStyle) {
            return;
        }
        context.strokeStyle = style.boundsStyle;
        context.lineWidth = style.boundsWidth;
        context.lineJoin = style.boundsJoin;
        if (style.boundsDash) {
            context.setLineDash(style.boundsDash);
            context.lineDashOffset = style.boundsDashOffset;
        } else {
            context.setLineDash([]);
        }
        context.shadowColor = Utils.Constants.TRANSPARENT;
        context.globalAlpha = style.boundsOpacity;
        context.globalCompositeOperation = 'source-over';
    };
    /** dts2md break */
    /**
     * Compute style properties from children's and parent's.
     */
    export const compute = (
        output: CanvasStyle,
        parentStyle: CanvasStyle,
        childStyle: Partial<CanvasStyle>,
    ) => {

        output.fillStyle = childStyle.fillStyle ?? defaults.fillStyle;
        output.strokeStyle = childStyle.strokeStyle ?? defaults.strokeStyle;
        output.lineWidth = childStyle.lineWidth || parentStyle.lineWidth;
        output.lineCap = childStyle.lineCap || parentStyle.lineCap;
        output.lineJoin = childStyle.lineJoin || parentStyle.lineJoin;
        output.miterLimit = childStyle.miterLimit ?? parentStyle.miterLimit;
        output.lineDashOffset = childStyle.lineDashOffset ?? parentStyle.lineDashOffset;
        output.lineDash = childStyle.lineDash || parentStyle.lineDash;

        output.font = childStyle.font || parentStyle.font;
        output.direction = childStyle.direction || parentStyle.direction;
        output.textAlign = childStyle.textAlign || parentStyle.textAlign;
        output.textBaseline = childStyle.textBaseline || parentStyle.textBaseline;

        output.shadowColor = childStyle.shadowColor || defaults.shadowColor;
        output.shadowBlur = childStyle.shadowBlur ?? defaults.shadowBlur;
        output.shadowOffsetX = childStyle.shadowOffsetX ?? defaults.shadowOffsetX;
        output.shadowOffsetY = childStyle.shadowOffsetY ?? defaults.shadowOffsetY;

        output.opacity = childStyle.opacity ?? parentStyle.opacity;
        output.compositeOperation = childStyle.compositeOperation || parentStyle.compositeOperation;
        output.ratio = childStyle.ratio || parentStyle.ratio;

        output.boundsStyle = childStyle.boundsStyle || parentStyle.boundsStyle;
        output.boundsWidth = childStyle.boundsWidth || parentStyle.boundsWidth;
        output.boundsJoin = childStyle.boundsJoin || parentStyle.boundsJoin;
        output.boundsDashOffset = childStyle.boundsDashOffset ?? parentStyle.boundsDashOffset;
        output.boundsDash = childStyle.boundsDash || parentStyle.boundsDash;
        output.boundsOpacity = childStyle.boundsOpacity ?? parentStyle.boundsOpacity;

    };

}
