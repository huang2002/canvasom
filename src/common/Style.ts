import { Utils } from './Utils';

export interface CanvasStyle {

    fillStyle: null | string | CanvasGradient | CanvasPattern;
    strokeStyle: null | string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    lineDashOffset: number;
    lineDash: null | number[];
    miterLimit: number;

    direction: CanvasDirection;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;

    shadowColor: null | string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;

    opacity: number;
    ratio: number;

}

export namespace Style {

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
