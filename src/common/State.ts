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
export type StateEvent<DataType> =
    | StateBeforeChangeEvent<DataType>
    | StateAfterChangeEvent<DataType>;
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
    get currentValue() {
        return this._value;
    }
    /** dts2md break */
    /**
     * Set the current value.
     * (Emits `beforeChange` and `afterChange` events.)
     */
    set currentValue(value: DataType) {

        const { _value: previousValue } = this;

        const willChangeEvent: StateBeforeChangeEvent<DataType> = new Event({
            name: 'beforeChange',
            stoppable: true,
            cancelable: true,
            data: {
                previousValue,
                currentValue: value,
            },
        });

        this.emit(willChangeEvent);
        if (willChangeEvent.canceled) {
            return;
        }

        this._value = value;

        const changedEvent: StateAfterChangeEvent<DataType> = new Event({
            name: 'afterChange',
            stoppable: true,
            data: {
                previousValue,
                currentValue: value,
            },
        });
        this.emit(changedEvent);

    }

}
