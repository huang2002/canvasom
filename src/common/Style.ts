import { Utils } from './Utils';

/**
 * The interface of canvas style properties
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
     * The canvas pixel ratio
     * @default window.devicePixelRatio
     */
    ratio: number;
    /**
     * When this is set, the bounds of the node will be rendered
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
     * @default 1
     */
    boundsOpacity: number;
}

export namespace Style {

    /**
     * The defaults of canvas styles (mutable)
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
        boundsOpacity: 1,

    };

    /**
     * Apply the style to the canvas context
     * (bounds styles are ignored; use `Style.applyBounds` if needed)
     */
    export const apply = (context: CanvasRenderingContext2D, style: CanvasStyle) => {
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
            context.shadowColor = Utils.Const.TRANSPARENT;
        }
        context.globalAlpha = style.opacity;
        context.globalCompositeOperation = style.compositeOperation;
    };

    /**
     * Apply bounds style to the canvas context
     */
    export const applyBounds = (context: CanvasRenderingContext2D, style: CanvasStyle) => {
        if (style.boundsStyle) {
            context.strokeStyle = style.boundsStyle;
            context.lineWidth = style.boundsWidth;
            context.lineJoin = style.boundsJoin;
            if (style.boundsDash) {
                context.setLineDash(style.boundsDash);
                context.lineDashOffset = style.boundsDashOffset;
            } else {
                context.setLineDash([]);
            }
            context.shadowColor = Utils.Const.TRANSPARENT;
            context.globalAlpha = style.boundsOpacity;
            context.globalCompositeOperation = 'source-over';
        }
    };

    /**
     * Compute the style properties from the child's and its parent's styles
     */
    export const compute = (
        output: CanvasStyle,
        parentStyle: CanvasStyle,
        childStyle: Partial<CanvasStyle>
    ) => {

        output.fillStyle = Utils.pick(childStyle.fillStyle, defaults.fillStyle);
        output.strokeStyle = Utils.pick(childStyle.strokeStyle, defaults.strokeStyle);
        output.lineWidth = childStyle.lineWidth || parentStyle.lineWidth;
        output.lineCap = childStyle.lineCap || parentStyle.lineCap;
        output.lineJoin = childStyle.lineJoin || parentStyle.lineJoin;
        output.miterLimit = Utils.pick(childStyle.miterLimit, parentStyle.miterLimit);
        output.lineDashOffset = Utils.pick(childStyle.lineDashOffset, parentStyle.lineDashOffset);
        output.lineDash = childStyle.lineDash || parentStyle.lineDash;

        output.font = childStyle.font || parentStyle.font;
        output.direction = childStyle.direction || parentStyle.direction;
        output.textAlign = childStyle.textAlign || parentStyle.textAlign;
        output.textBaseline = childStyle.textBaseline || parentStyle.textBaseline;

        output.shadowColor = childStyle.shadowColor || defaults.shadowColor;
        output.shadowBlur = Utils.pick(childStyle.shadowBlur, defaults.shadowBlur);
        output.shadowOffsetX = Utils.pick(childStyle.shadowOffsetX, defaults.shadowOffsetX);
        output.shadowOffsetY = Utils.pick(childStyle.shadowOffsetY, defaults.shadowOffsetY);

        output.opacity = Utils.pick(childStyle.opacity, parentStyle.opacity);
        output.compositeOperation = childStyle.compositeOperation || parentStyle.compositeOperation;
        output.ratio = childStyle.ratio || parentStyle.ratio;

        output.boundsStyle = childStyle.boundsStyle || parentStyle.boundsStyle;
        output.boundsWidth = childStyle.boundsWidth || parentStyle.boundsWidth;
        output.boundsJoin = childStyle.boundsJoin || parentStyle.boundsJoin;
        output.boundsDashOffset = Utils.pick(childStyle.boundsDashOffset, parentStyle.boundsDashOffset);
        output.boundsDash = childStyle.boundsDash || parentStyle.boundsDash;
        output.boundsOpacity = Utils.pick(childStyle.boundsOpacity, parentStyle.boundsOpacity);

    };

}
