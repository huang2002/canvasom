import { Event } from './Event';

export type Listener = (event: Event<any>) => void;

export interface ListenerRecord {
    listener: Listener;
    once: boolean;
}

export interface ListenerDeclaration {
    [type: string]: Listener | { listener: Listener; once: boolean; };
}

export type EventTargetOptions = Partial<{
    listeners: ListenerDeclaration;
}>;

export class EventTarget {

    private _listenerMap = new Map<string, ListenerRecord[]>();
    protected _parent: EventTarget | null = null;

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
