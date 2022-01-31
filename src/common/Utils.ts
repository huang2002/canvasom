import type { CanvasNode, CanvasNodeEvents } from '../core/CanvasNode';

/**
 * Utilities.
 */
export namespace Utils {
    /** dts2md break */
    /**
     * Constants.
     */
    export namespace Constants {
        /**
         * `'rgba(0,0,0,0)'`
         */
        export const TRANSPARENT = 'rgba(0,0,0,0)';
        /**
         * `Math.PI`
         */
        export const PI = Math.PI;
        /**
         * `Math.PI / 2`
         */
        export const HALF_PI = PI / 2;
        /**
         * `Math.PI / 2 * 3`
         */
        export const THREE_HALVES_PI = HALF_PI * 3;
        /**
         * `Math.PI * 2`
         */
        export const TWO_PI = PI * 2;
        /**
         * Whether the device supports touch events.
         * (`navigator.maxTouchPoints > 0`)
         */
        export const SUPPORTS_TOUCH_EVENTS = navigator.maxTouchPoints > 0;

    }
    /** dts2md break */
    /**
     * Extract value types from specific map type.
     */
    export type ValueType<T extends {}> = T[keyof T];
    /** dts2md break */
    /**
     * Emits an event following the given target path.
     * (From the last one to the first one;
     * stops if the event is stopped by `event.stop`.)
     */
    export const bubbleEvent = (
        event: ValueType<CanvasNodeEvents>,
        targetPath: CanvasNode<any>[],
    ) => {
        for (let i = targetPath.length - 1; i >= 0; i--) {
            targetPath[i].emit(event);
            if (event.stopped) {
                break;
            }
        }
    };
    /** dts2md break */
    /**
     * Select a descendent node with specific id.
     * (Returns `null` if not found.)
     */
    export const selectId = (
        id: string,
        node: CanvasNode<any>,
    ): CanvasNode<any> | null => {

        const { childNodes } = node;
        let childNode, childResult;

        for (let i = 0; i < childNodes.length; i++) {

            childNode = childNodes[i];

            if (childNode.id === id) {
                return childNode;
            }

            if (childNode.childNodes.length) {
                childResult = selectId(id, childNode);
                if (childResult) {
                    return childResult;
                }
            }

        }

        return null;

    };
    /** dts2md break */
    /**
     * Select descendent nodes with specific tag name.
     */
    export const selectTag = (
        tag: string,
        node: CanvasNode<any>,
        output?: CanvasNode<any>[],
    ): CanvasNode<any>[] => {

        const result = output ?? [];

        node.childNodes.forEach(childNode => {
            if (childNode.tag === tag) {
                result.push(childNode);
            }
            if (childNode.childNodes.length) {
                selectTag(tag, childNode, result);
            }
        });

        return result;

    };
    /** dts2md break */
    /**
     * Select descendent nodes with specific class name.
     */
    export const selectClass = (
        className: string,
        node: CanvasNode<any>,
        output?: CanvasNode<any>[],
    ): CanvasNode<any>[] => {

        const result = output ?? [];

        node.childNodes.forEach(childNode => {
            if (childNode.classNames.includes(className)) {
                result.push(childNode);
            }
            if (childNode.childNodes.length) {
                selectClass(className, childNode, result);
            }
        });

        return result;

    };

}
