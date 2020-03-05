export type SizingResult = Readonly<{
    width: number;
    height: number;
    styleWidth: number;
    styleHeight: number;
    left: number;
    top: number;
    scale: number;
}>;
/** dts2md break */
export type SizingStrategy = (
    designWidth: number,
    designHeight: number,
    refWidth: number,
    refHeight: number,
    margin: number
) => SizingResult;
/** dts2md break */
/**
 * This namespace contains the built-in sizing strategies
 * (you can create your own one if needed; when doing so,
 * you can refer to the source code of these built-in ones)
 */
export namespace Sizing {

    /**
     * Fill all available space in container
     */
    export const Fill: SizingStrategy
        = (designWidth, designHeight, refWidth, refHeight, margin) => {
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
        };

    /**
     * Scale the canvas to the maximum size
     * that the container can contain
     */
    export const Contain: SizingStrategy
        = (designWidth, designHeight, refWidth, refHeight, margin) => {
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
        };

    /**
     * Just center the canvas without scaling
     * (ignores the margin parameter)
     */
    export const None: SizingStrategy
        = (designWidth, designHeight, refWidth, refHeight, margin) => ({
            width: designWidth,
            height: designHeight,
            styleWidth: designWidth,
            styleHeight: designHeight,
            left: (refWidth - designWidth) / 2,
            top: (refHeight - designHeight) / 2,
            scale: 1
        });

    /**
     * Scale the canvas but keep the width fixed
     * and stretch the height to the maximum
     */
    export const FixedWidth: SizingStrategy
        = (designWidth, designHeight, refWidth, refHeight, margin) => {
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
        };

    /**
     * Scale the canvas but keep the height fixed
     * and stretch the width to the maximum
     */
    export const FixedHeight: SizingStrategy
        = (designWidth, designHeight, refWidth, refHeight, margin) => {
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
        };

    /**
     * A smart fixed strategy that adopts `FixedWidth` when
     * the ratio(width / height) of container is larger than
     * that of the design size; or `FixedHeight` otherwise
     */
    export const Fixed: SizingStrategy
        = (designWidth, designHeight, refWidth, refHeight, margin) => (
            (refWidth / refHeight > designWidth / designHeight)
                ? FixedHeight(designWidth, designHeight, refWidth, refHeight, margin)
                : FixedWidth(designWidth, designHeight, refWidth, refHeight, margin)
        );

}
