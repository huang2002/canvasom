import { Node } from '../nodes/Node';
import { Root } from '../nodes/Root';

export namespace Utils {
    /** dts2md break */
    export const Const = {
        /**
         * Math.PI * 2
         */
        TWO_PI: Math.PI * 2,
        /**
         * Math.PI / 2
         */
        HALF_PI: Math.PI / 2,
        /**
         * Math.PI * 1.5
         */
        THREE_HALVES_PI: Math.PI * 1.5,
        /**
         * 'rgba(0,0,0,0)'
         */
        TRANSPARENT: 'rgba(0,0,0,0)',
        /**
         * Whether it is now in touch mode
         * (detected using `navigator.maxTouchPoints`
         * and `navigator.userAgent`)
         */
        IS_TOUCH_MODE: navigator.maxTouchPoints > 0
            || /iOS|iPhone|iPod|iPad/.test(navigator.userAgent),
    } as const;
    /** dts2md break */
    /**
     * Remove the element at the given index in the array
     */
    export const removeIndex = (array: unknown[], index: number) => {
        if (!index) {
            array.shift();
        } else {
            const end = array.length - 1;
            if (index < end) {
                for (; index < end; index++) {
                    array[index] = array[index + 1];
                }
                array.length--;
            } else {
                array.pop();
            }
        }
    };

    /** dts2md break */
    /**
     * Insert the item at the given index in the array
     */
    export const insertIndex = <T = unknown>(array: T[], index: number, item: T) => {
        if (!index) {
            array.unshift(item);
        } else if (index < array.length) {
            const end = array.length++ - 1;
            for (let i = end; i >= index; i--) {
                array[i + 1] = array[i];
            }
            array[index] = item;
        } else {
            array.push(item);
        }
    };

    /** dts2md break */
    /**
     * @returns typeof value === 'undefined' ? defaultValue : value
     */
    export const pick = <T>(value: T | undefined, defaultValue: T) =>
        typeof value === 'undefined' ? defaultValue : value;

    /** dts2md break */
    /**
     * @returns rad / Math.PI * 180
     */
    export const rad2deg = (rad: number) => rad / Math.PI * 180;

    /** dts2md break */
    /**
     * @returns deg / 180 * Math * PI
     */
    export const deg2rad = (deg: number) => deg / 180 * Math.PI;

    /** dts2md break */
    /**
     * @returns a + (b - a) * k
     */
    export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

    /** dts2md break */
    /**
     * @returns value < min ? min : (value > max ? max : value)
     * @example
     * ```js
     * COM.Utils.clamp(6, 0, 10); // 6
     * COM.Utils.clamp(-6, 0, 10); // 0
     * COM.Utils.clamp(66, 0, 10); // 10
     * ```
     */
    export const clamp = (value: number, min: number, max: number) => {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };

    /** dts2md break */
    /**
     * Get all the roots of the given node
     */
    export const getRoots = (node: Node) => {
        const roots = [];
        let current: Node | null = node;
        while (current) {
            if (current instanceof Root) {
                roots.push(current);
            }
            current = current.parentNode;
        }
        return roots;
    };

    /** dts2md break */
    /**
     * Render the nodes with the given context
     */
    export const renderNodes = (nodes: Node[], context: CanvasRenderingContext2D) => {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].render(context);
        }
    };

    /** dts2md break */
    /**
     * Get a wrapper of the function that invokes it
     * after the given delay when called. When
     * several calls are made before the function is
     * actually invoked, only the last one will take
     * effect and the timer will be reset.
     * @example
     * ```js
     * const f = COM.Utils.debounce(console.log, 1000);
     *
     * f(0);
     * f(1);
     * f(2);
     *
     * // 1s later in console: 2
     * ```
     */
    export const debounce = <T extends unknown[]>(
        fn: (...args: T) => any,
        delay: number,
        thisArg?: unknown
    ) => {
        const callback = (args: T) => {
            fn.apply(thisArg, args);
        };
        let timer: number | null = null;
        return function debounceWrapper(...args: T) {
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(callback, delay, args);
        };
    };


}
