export type TimingFunction = (x: number) => number;

export namespace Timing {

    export const linear: TimingFunction = (x: number) => x;

    const _interpolate = (p1: number, p2: number, t: number) => {
        const _t = 1 - t;
        return (
            3 * p1 * _t * _t * t
            + 3 * p2 * t * t * _t
            + t * t * t
        );
    };

    export const cubic = (x1: number, y1: number, x2: number, y2: number): TimingFunction => (
        x => {
            if (x <= 0) {
                return 0;
            } else if (x >= 1) {
                return 1;
            }
            const { accuracy } = cubic;
            let l = 0,
                r = 1,
                t = .5,
                cur = _interpolate(x1, x2, t);
            while (Math.abs(cur - x) > accuracy) {
                if (cur > x) {
                    r = t;
                } else {
                    l = t;
                }
                t = (l + r) / 2;
                cur = _interpolate(x1, x2, t);
            }
            return _interpolate(y1, y2, t);
        }
    );
    cubic.accuracy = .001;

    export const ease = cubic(.25, .2, .25, 1);
    export const easeIn = cubic(.42, 0, 1, 1);
    export const easeOut = cubic(0, 0, .58, 1);
    export const easeInOut = cubic(.42, 0, 0.25, 1);

    export const steps = (stepCount: number, start?: boolean): TimingFunction => (
        x => {
            let t = Math.floor(x * stepCount);
            if (start && t < stepCount) {
                t += 1;
            }
            return t / stepCount;
        }
    );

}
