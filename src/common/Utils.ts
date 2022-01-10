import type { EventEmitter, EventListener, EventMap, ListenerRecord } from '3h-event';
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
     * Map the given event type to a listener description dict.
     */
    export type EventListeners<Events extends EventMap> = {
        [Name in keyof Events]: (
            | EventListener<Events[Name]>
            | ListenerRecord<Events[Name]>
        );
    };
    /** dts2md break */
    /**
     * Add a few event listeners by providing a dict.
     * (eventName -> listener | listenerRecord)
     * @example
     * ```js
     * COM.Utils.addListeners(rectNode, {
     *     click: clickListener, // listener
     *     pointerstart: { // listenerRecord
     *         listener: pointerStartListener,
     *         once: true,
     *     },
     * });
     * ```
     */
    export const addListeners = <Events extends EventMap>(
        target: EventEmitter<Events>,
        listeners: Partial<Utils.EventListeners<Events>>,
    ) => {

        let value;

        // strings
        (Object.getOwnPropertyNames(listeners) as (keyof Events)[])
            .forEach(name => {
                value = listeners[name]!;
                if (typeof value === 'function') {
                    target.addListener(name, value);
                } else {
                    target.addListener(name, value.listener, value.once);
                }
            });

        // symbols
        (Object.getOwnPropertySymbols(listeners) as (keyof Events)[])
            .forEach(symbol => {
                value = listeners[symbol]!;
                if (typeof value === 'function') {
                    target.addListener(symbol, value);
                } else {
                    target.addListener(symbol, value.listener, value.once);
                }
            });

    };
    /** dts2md break */
    /**
     * Emits an event following the given target path.
     * (From the last one to the first one;
     * stops if the event is stopped by `event.stop`.)
     */
    export const bubbleEvent = (
        event: ValueType<CanvasNodeEvents>,
        targetPath: CanvasNode[],
    ) => {
        for (let i = targetPath.length - 1; i >= 0; i--) {
            targetPath[i].emit(event);
            if (event.stopped) {
                break;
            }
        }
    };

}
