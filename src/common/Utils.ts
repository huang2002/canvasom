import { Event, EventListener, ListenerRecord, SelectEvent } from '3h-event';
import type { CanvasNode, CanvasNodeEvent } from '../core/CanvasNode';

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
     * Map the given event type to a listener description dict.
     */
    export type EventListeners<EventType extends Event> = {
        [Name in EventType['name']]: (
            | EventListener<SelectEvent<EventType, Name>>
            | ListenerRecord<SelectEvent<EventType, Name>>
        );
    };
    /** dts2md break */
    /**
     * Emits an event following the given target path.
     * (From the last one to the first one;
     * stops if the event is stopped by `event.stop`.)
     */
    export const bubbleEvent = (
        event: CanvasNodeEvent,
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
