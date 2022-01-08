/**
 * Type of timing functions.
 */
export type TimingFunction = (x: number) => number;
/** dts2md break */
/**
 * Timing functions and factories.
 */
export namespace Timing {
    /** dts2md break */
    /**
     * Linear timing function.
     */
    export const linear: TimingFunction = (x: number) => x;

    const _interpolateCubic = (p1: number, p2: number, t: number) => {
        const _t = 1 - t;
        return (
            3 * p1 * _t * _t * t
            + 3 * p2 * t * t * _t
            + t * t * t
        );
    };
    /** dts2md break */
    /**
     * Accuracy parameter used in {@link cubic}.
     * @default 0.002
     */
    export let cubicAccuracy = .002;
    /** dts2md break */
    /**
     * Factory of cubic bezier timing function.
     */
    export const cubic = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): TimingFunction => (
        (x) => {

            if (x <= 0) {
                return 0;
            } else if (x >= 1) {
                return 1;
            }

            let left = 0;
            let right = 1;
            let t = .5;
            let current = _interpolateCubic(x1, x2, t);

            while (Math.abs(current - x) > cubicAccuracy) {
                if (current > x) {
                    right = t;
                } else {
                    left = t;
                }
                t = (left + right) / 2;
                current = _interpolateCubic(x1, x2, t);
            }

            return _interpolateCubic(y1, y2, t);

        }
    );
    /** dts2md break */
    /**
     * `cubic(0.25, 0.2, 0.25, 1)`
     */
    export const ease = cubic(.25, .2, .25, 1);
    /** dts2md break */
    /**
     * `cubic(0.42, 0, 1, 1)`
     */
    export const easeIn = cubic(.42, 0, 1, 1);
    /** dts2md break */
    /**
     * `cubic(0, 0, 0.58, 1)`
     */
    export const easeOut = cubic(0, 0, .58, 1);
    /** dts2md break */
    /**
     * `cubic(0.42, 0, 0.25, 1)`
     */
    export const easeInOut = cubic(.42, 0, .25, 1);
    /** dts2md break */
    /**
     * Step timing function.
     * @param start Whether to jump at start. (default: `false`)
     */
    export const steps = (stepCount: number, start = false): TimingFunction => (
        x => {
            let t = Math.floor(x * stepCount);
            if (start && t < stepCount) {
                t += 1;
            }
            return t / stepCount;
        }
    );

}
