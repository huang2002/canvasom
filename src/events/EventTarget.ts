import { Event } from './Event';

export type Listener = (event: Event<any>) => void;
/** dts2md break */
export interface ListenerRecord {
    listener: Listener;
    once: boolean;
}
/** dts2md break */
export interface ListenerDeclaration {
    [type: string]: Listener | { listener: Listener; once: boolean; };
}
/** dts2md break */
export type EventTargetOptions = Partial<{
    listeners: ListenerDeclaration;
}>;
/** dts2md break */
export class EventTarget {

    private _listenerMap = new Map<string, ListenerRecord[]>();
    /** dts2md break */
    /**
     * The parent target
     * (if an event bubbles, it will spread to the parent)
     */
    protected _parent: EventTarget | null = null;

    /** dts2md break */
    /**
     * A utility setter that enables you to
     * set several listeners at one time
     * @example
     * ```js
     * eventTarget.listeners = {
     *     pointerup: (event) => {
     *         // ...
     *     },
     *     pointermove: {
     *         listener: (event) => {
     *             // ...
     *         },
     *         once: true
     *     }
     * };
     * ```
     */
    set listeners(listeners: ListenerDeclaration) {
        Object.keys(listeners).forEach(type => {
            const declaration = listeners[type];
            if (typeof declaration === 'function') {
                this.addListener(type, declaration);
            } else {
                this.addListener(type, declaration.listener, declaration.once);
            }
        });
    }

    /** dts2md break */
    /**
     * Add a listener the given type of event
     * @param once Whether the listener should be
     * removed once it is invoked (default: false)
     */
    addListener(type: string, listener: Listener, once?: boolean) {
        const { _listenerMap } = this,
            records = _listenerMap.get(type);
        if (records) {
            if (!records.some(record => record.listener === listener && record.once === once)) {
                records.push({ listener, once: !!once });
            }
        } else {
            _listenerMap.set(type, [{ listener, once: !!once }]);
        }
        return this;
    }

    /** dts2md break */
    /**
     * Remove a listener
     * (the same arguments as those passed to `addListener`
     * should be provided; regards once as false when it is omitted)
     */
    removeListener(type: string, listener: Listener, once?: boolean) {
        const { _listenerMap } = this,
            records = _listenerMap.get(type);
        if (records) {
            _listenerMap.set(
                type,
                records.filter(
                    record => record.listener !== listener || record.once !== once
                )
            );
        }
        return this;
    }

    /** dts2md break */
    /**
     * @returns event.defaultPrevented
     */
    dispatchEvent(event: Event<unknown>) {
        const { _listenerMap } = this,
            records = _listenerMap.get(event.type);
        if (records) {
            _listenerMap.set(
                event.type,
                records.filter(record => {
                    record.listener.call(this, event);
                    return !record.once;
                })
            );
        }
        if (!event.propagationStopped && this._parent) {
            this._parent.dispatchEvent(event);
        }
        return event.defaultPrevented;
    }


}
