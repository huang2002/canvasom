export type SizingResult = Readonly<{
    width: number;
    height: number;
    styleWidth: number;
    styleHeight: number;
    left: number;
    top: number;
    scale: number;
}>;

export type SizingStrategy = (
    designWidth: number,
    designHeight: number,
    refWidth: number,
    refHeight: number,
    margin: number
) => SizingResult;

export type SizingObject = Record<
    'Fill' | 'Contain' | 'None' | 'FixedWidth' | 'FixedHeight' | 'Fixed',
    SizingStrategy
>;

export const Sizing: SizingObject = {

    Fill(designWidth, designHeight, refWidth, refHeight, margin) {
        const doubleMargin = margin * 2,
            width = refWidth - doubleMargin,
            height = refHeight - doubleMargin;
        return {
            width,
            height,
            styleWidth: width,
            styleHeight: height,
            left: margin,
            top: margin,
            scale: 1
        };
    },

    Contain(designWidth, designHeight, refWidth, refHeight, margin) {
        const scale =
            refWidth / refHeight > designWidth / designHeight
                ? (refHeight - margin * 2) / designHeight
                : (refWidth - margin * 2) / designWidth,
            width = designWidth * scale,
            height = designHeight * scale;
        return {
            width: designWidth,
            height: designHeight,
            styleWidth: width,
            styleHeight: height,
            left: (refWidth - width) / 2,
            top: (refHeight - height) / 2,
            scale
        };
    },

    None: (designWidth, designHeight, refWidth, refHeight, margin) => ({
        width: designWidth,
        height: designHeight,
        styleWidth: designWidth,
        styleHeight: designHeight,
        left: (refWidth - designWidth) / 2,
        top: (refHeight - designHeight) / 2,
        scale: 1
    }),

    FixedWidth(designWidth, designHeight, refWidth, refHeight, margin) {
        const doubleMargin = margin * 2,
            styleWidth = refWidth - doubleMargin,
            styleHeight = refHeight - doubleMargin,
            scale = styleWidth / designWidth;
        return {
            width: designWidth,
            height: styleHeight / scale,
            styleWidth,
            styleHeight,
            left: margin,
            top: margin,
            scale
        };
    },

    FixedHeight(designWidth, designHeight, refWidth, refHeight, margin) {
        const doubleMargin = margin * 2,
            styleWidth = refWidth - doubleMargin,
            styleHeight = refHeight - doubleMargin,
            scale = styleHeight / designHeight;
        return {
            width: styleWidth / scale,
            height: designHeight,
            styleWidth,
            styleHeight,
            left: margin,
            top: margin,
            scale
        };
    },

    Fixed: (designWidth, designHeight, refWidth, refHeight, margin) => (
        (refWidth / refHeight > designWidth / designHeight)
            ? Sizing.FixedHeight(designWidth, designHeight, refWidth, refHeight, margin)
            : Sizing.FixedWidth(designWidth, designHeight, refWidth, refHeight, margin)
    ),

};
