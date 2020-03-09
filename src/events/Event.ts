import { EventTarget } from './EventTarget';

export interface EventOptions<T> {
    cancelable?: boolean;
    bubbles?: boolean;
    target?: EventTarget | null;
    data: Readonly<T>;
}
/** dts2md break */
export class Event<T> {

    /** dts2md break */
    constructor(readonly type: string, options?: EventOptions<T>) {
        if (options) {
            this.cancelable = !!options.cancelable;
            this.bubbles = !!options.bubbles;
            this.propagationStopped = !options.bubbles;
            this.target = options.target || null;
            this.data = options.data;
        } else {
            this.cancelable = this.bubbles = false;
            this.propagationStopped = true;
            this.target = null;
        }
    }

    /** dts2md break */
    /**
     * Whether the default action can be canceled
     * @default false
     */
    readonly cancelable: boolean;
    /** dts2md break */
    /**
     * Whether the event bubbles
     * @default false
     */
    readonly bubbles: boolean;
    /** dts2md break */
    readonly target: EventTarget | null;
    /** dts2md break */
    readonly data!: Readonly<T>;
    /** dts2md break */
    /**
     * Whether `preventDefault` has been invoked
     */
    readonly defaultPrevented: boolean = false;
    /** dts2md break */
    /**
     * Whether `stopPropagation` has been invoked
     */
    readonly propagationStopped: boolean;

    /** dts2md break */
    /**
     * Prevent the default action
     */
    preventDefault() {
        (this.defaultPrevented as boolean) = true;
    }

    /** dts2md break */
    /**
     * Stop the propagation of the event
     */
    stopPropagation() {
        (this.propagationStopped as boolean) = true;
    }

}
