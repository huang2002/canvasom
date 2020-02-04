import { Node } from '../nodes/Node';
import { Root } from '../nodes/Root';

export namespace Utils {

    export const Const = {
        TWO_PI: Math.PI * 2,
        HALF_PI: Math.PI / 2,
        THREE_HALVES_PI: Math.PI * 1.5,
        TRANSPARENT: 'rgba(0,0,0,0)',
        IS_TOUCH_MODE: navigator.maxTouchPoints > 0
            || /iOS|iPhone|iPod|iPad/.test(navigator.userAgent),
    } as const;

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

    export const pick = <T>(value: T | undefined, defaultValue: T) =>
        typeof value === 'undefined' ? defaultValue : value;

    export const rad2deg = (rad: number) => rad / Math.PI * 180;

    export const deg2rad = (deg: number) => deg / 180 * Math.PI;

    export const clamp = (value: number, min: number, max: number) => {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };

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

    export const renderNodes = (nodes: Node[], context: CanvasRenderingContext2D) => {
        nodes.forEach(node => {
            node.render(context);
        });
    };

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
