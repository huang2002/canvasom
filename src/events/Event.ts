import { EventTarget } from './EventTarget';

export interface EventOptions<T> {
    cancelable?: boolean;
    bubbles?: boolean;
    target?: EventTarget | null;
    data: Readonly<T>;
}

export class Event<T> {

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

    readonly cancelable: boolean;
    readonly bubbles: boolean;
    readonly target: EventTarget | null;
    readonly data!: Readonly<T>;
    readonly defaultPrevented: boolean = false;
    readonly propagationStopped: boolean;

    preventDefault() {
        (this.defaultPrevented as boolean) = true;
    }

    stopPropagation() {
        (this.propagationStopped as boolean) = true;
    }

}
