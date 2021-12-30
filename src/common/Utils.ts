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

}
