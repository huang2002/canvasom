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
     * The canvas pixel ratio
     * @default window.devicePixelRatio
     */
    ratio: number;
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
        ratio: window.devicePixelRatio || 1,

    };

    /**
     * Apply the style to the canvas context
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
        output.lineWidth = childStyle.lineWidth || defaults.lineWidth;
        output.lineCap = childStyle.lineCap || defaults.lineCap;
        output.lineJoin = childStyle.lineJoin || defaults.lineJoin;
        output.miterLimit = Utils.pick(childStyle.miterLimit, defaults.miterLimit);
        output.lineDashOffset = Utils.pick(childStyle.lineDashOffset, defaults.lineDashOffset);
        output.lineDash = childStyle.lineDash || defaults.lineDash;

        output.font = childStyle.font || parentStyle.font;
        output.direction = childStyle.direction || parentStyle.direction;
        output.textAlign = childStyle.textAlign || parentStyle.textAlign;
        output.textBaseline = childStyle.textBaseline || parentStyle.textBaseline;

        output.shadowColor = childStyle.shadowColor || defaults.shadowColor;
        output.shadowBlur = Utils.pick(childStyle.shadowBlur, defaults.shadowBlur);
        output.shadowOffsetX = Utils.pick(childStyle.shadowOffsetX, defaults.shadowOffsetX);
        output.shadowOffsetY = Utils.pick(childStyle.shadowOffsetY, defaults.shadowOffsetY);

        output.opacity = Utils.pick(childStyle.opacity, defaults.opacity);
        output.ratio = childStyle.ratio || parentStyle.ratio;

    };

}
