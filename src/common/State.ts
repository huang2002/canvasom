import { Event, EventEmitter } from "3h-event";

/**
 * Type of state-related event data.
 */
export interface StateEventData<DataType> {
    readonly previousValue: DataType;
    readonly currentValue: DataType;
}
/** dts2md break */
/**
 * Emits when state will change.
 * (You can cancel this event to prevent state from changing.)
 */
export type StateBeforeChangeEvent<DataType> =
    Event<'beforeChange', StateEventData<DataType>>;
/** dts2md break */
/**
 * Emits when state has changed.
 */
export type StateAfterChangeEvent<DataType> =
    Event<'afterChange', StateEventData<DataType>>;
/** dts2md break */
/**
 * Type of state events.
 */
export type StateEvent<DataType> = (
    | StateBeforeChangeEvent<DataType>
    | StateAfterChangeEvent<DataType>
);
/** dts2md break */
/**
 * Class of state objects.
 */
export class State<DataType = unknown>
    extends EventEmitter<StateEvent<DataType>> {
    /** dts2md break */
    /**
     * Constructor of `State`.
     */
    constructor(initialValue: DataType) {
        super();
        this._value = initialValue;
    }

    private _value: DataType;
    /** dts2md break */
    /**
     * Get the current value.
     */
    get value() {
        return this._value;
    }
    /** dts2md break */
    /**
     * Set the current value.
     * (Emits `beforeChange` and `afterChange` events.)
     */
    set value(newValue: DataType) {

        const { _value: previousValue } = this;

        const beforeChangeEvent: StateBeforeChangeEvent<DataType> = new Event({
            name: 'beforeChange',
            stoppable: true,
            cancelable: true,
            data: {
                previousValue,
                currentValue: newValue,
            },
        });

        this.emit(beforeChangeEvent);
        if (beforeChangeEvent.canceled) {
            return;
        }

        this._value = newValue;

        const afterChangeEvent: StateAfterChangeEvent<DataType> = new Event({
            name: 'afterChange',
            stoppable: true,
            data: {
                previousValue,
                currentValue: newValue,
            },
        });
        this.emit(afterChangeEvent);

    }

}
