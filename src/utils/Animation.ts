import { Event, EventEmitter, EventListener } from '3h-event';
import { interpolate } from '3h-utils';
import { Schedule } from '../common/Schedule';
import { Utils } from '../common/Utils';
import { TimingFunction, Timing } from './Timing';

/**
 * Type of data of animation event.
 */
export interface AnimationEventData {
    /**
     * Current value. (In range [from, to].)
     */
    currentValue: number;
    /**
     * Current raw progress. (Linear; in range [0, 1].)
     */
    rawProgress: number;
    /**
     * Current progress. (`timing(rawProgress)`)
     */
    progress: number;
}
/** dts2md break */
/**
 * Emits when animation starts. (stoppable&cancelable)
 */
export type AnimationStartEvent = Event<'start', AnimationEventData>;
/** dts2md break */
/**
 * Emits when animation stops(pauses). (stoppable&cancelable)
 */
export type AnimationStopEvent = Event<'stop', AnimationEventData>;
/** dts2md break */
/**
 * Emits when animation resumes. (stoppable&cancelable)
 */
export type AnimationResumeEvent = Event<'resume', AnimationEventData>;
/** dts2md break */
/**
 * Emits when animation updates. (cancelable)
 */
export type AnimationUpdateEvent = Event<'update', AnimationEventData>;
/** dts2md break */
/**
 * Emits when animation finishes. (stoppable&cancelable)
 */
export type AnimationFinishEvent = Event<'finish', AnimationEventData>;
/** dts2md break */
/**
 * Type map of animation events.
 */
export type AnimationEvents = {
    start: AnimationStartEvent;
    stop: AnimationStopEvent;
    resume: AnimationResumeEvent;
    update: AnimationUpdateEvent;
    finish: AnimationFinishEvent;
};
/** dts2md break */
/**
 * Type of options of {@link Animation}.
 */
export type AnimationOptions<Events extends AnimationEvents> = Partial<{
    /**
     * Start value.
     * @default 0
     */
    from: number;
    /**
     * End value.
     * @default 1
     */
    to: number;
    /**
     * Duration of animation. (ms)
     * @default 1000
     */
    duration: number;
    /**
     * The timing function to use.
     * @default Timing.linear
     */
    timing: TimingFunction;
    /**
     * The callback that is automatically
     * attached to `update` event.
     */
    callback: EventListener<Events['update']>;
    /**
     * Whether to emit `update` events when animation starts.
     * @default true
     */
    updateOnStart: boolean;
}>;
/** dts2md break */
/**
 * Class of animations.
 */
export class Animation<Events extends AnimationEvents = AnimationEvents>
    extends EventEmitter<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link Animation}.
     */
    constructor(options?: AnimationOptions<Events>) {
        super();
        this.from = options?.from ?? 0;
        this.to = options?.to ?? 1;
        this.duration = options?.duration ?? 1000;
        this.timing = options?.timing ?? Timing.linear;
        this.updateOnStart = options?.updateOnStart ?? true;
        if (options?.callback) {
            this.addListener('update', options.callback);
        }
    }
    /** dts2md break */
    /**
     * Start value.
     * @default 0
     */
    from: number;
    /** dts2md break */
    /**
     * End value.
     * @default 1
     */
    to: number;
    /** dts2md break */
    /**
     * Duration of animation. (ms)
     * @default 1000
     */
    duration: number;
    /** dts2md break */
    /**
     * The timing function to use.
     * @default Timing.linear
     */
    timing: TimingFunction;
    /** dts2md break */
    /**
     * Whether to emit `update` events when animation starts.
     * @default true
     */
    updateOnStart: boolean;

    private _active = false;
    private _currentValue = 0;
    private _rawProgress = 0;
    private _progress = 0;
    /** dts2md break */
    /**
     * Whether the animation is active.
     */
    get active() {
        return this._active;
    }
    /** dts2md break */
    /**
     * Current value. (In range [from, to].)
     */
    get currentValue() {
        return this._currentValue;
    }
    /** dts2md break */
    /**
     * Current raw progress. (Linear; in range [0, 1].)
     */
    get rawProgress() {
        return this._rawProgress;
    }
    /** dts2md break */
    /**
     * Current progress. (`timing(rawProgress)`)
     */
    get progress() {
        return this._progress;
    }

    private _startTimeStamp = 0;
    private _pauseTimeStamp = 0;
    private _offsetTime = 0;

    private _update(rawProgress: number) {

        const { from, to, timing } = this;
        const progress = timing(rawProgress);
        const currentValue = interpolate(from, to, progress);

        this._currentValue = currentValue;
        this._rawProgress = rawProgress;
        this._progress = progress;

        const event: AnimationUpdateEvent = new Event({
            name: 'update',
            stoppable: true,
            cancelable: false,
            data: {
                currentValue,
                rawProgress,
                progress,
            },
        });
        this.emit(event as unknown as Utils.ValueType<Events>);

    }
    /** dts2md break */
    /**
     * Start the animation.
     * (Executes `Schedule.animate(this)` automatically.)
     */
    start(timeStamp: number) {

        if (this._active) {
            return;
        }

        const event: AnimationStartEvent = new Event({
            name: 'start',
            timeStamp,
            stoppable: true,
            cancelable: true,
            data: {
                currentValue: this.from,
                rawProgress: 0,
                progress: 0,
            },
        });

        this.emit(event as unknown as Utils.ValueType<Events>);

        if (!event.canceled) {
            this._active = true;
            this._startTimeStamp = timeStamp;
            this._offsetTime = 0;
            this._currentValue = this.from;
            this._progress = 0;
            if (this.updateOnStart) {
                this._update(0);
            }
            Schedule.animate(this);
        }

    }
    /** dts2md break */
    /**
     * Stop the animation.
     * (Executes `Schedule.cancelAnimation(this)` automatically.)
     */
    stop(timeStamp: number) {

        if (!this._active || (this._rawProgress >= 1)) {
            return;
        }

        const event: AnimationStopEvent = new Event({
            name: 'stop',
            timeStamp,
            stoppable: true,
            cancelable: true,
            data: {
                currentValue: this._currentValue,
                rawProgress: this._rawProgress,
                progress: this._progress,
            },
        });

        this.emit(event as unknown as Utils.ValueType<Events>);

        if (!event.canceled) {
            this._active = false;
            this._pauseTimeStamp = timeStamp;
            Schedule.cancelAnimation(this);
        }

    }
    /** dts2md break */
    /**
     * Resume the animation.
     * (Executes `Schedule.animate(this)` automatically.)
     */
    resume(timeStamp: number) {

        if (this._active || (this._rawProgress >= 1)) {
            return;
        }

        const event: AnimationResumeEvent = new Event({
            name: 'resume',
            timeStamp,
            stoppable: true,
            cancelable: true,
            data: {
                currentValue: this._currentValue,
                rawProgress: this._rawProgress,
                progress: this._progress,
            },
        });

        this.emit(event as unknown as Utils.ValueType<Events>);

        if (!event.canceled) {
            this._active = true;
            this._offsetTime += this._pauseTimeStamp - timeStamp;
            Schedule.animate(this);
        }

    }
    /** dts2md break */
    /**
     * Finish the animation.
     * (Executes `Schedule.cancelAnimation(this)` automatically.)
     */
    finish(timeStamp: number) {

        if (this._rawProgress >= 1) {
            return;
        }

        const event: AnimationFinishEvent = new Event({
            name: 'finish',
            timeStamp,
            stoppable: true,
            cancelable: true,
            data: {
                currentValue: this._currentValue,
                rawProgress: this._rawProgress,
                progress: this._progress,
            },
        });

        this.emit(event as unknown as Utils.ValueType<Events>);

        if (!event.canceled) {
            this._update(1);
            this._active = false;
            Schedule.cancelAnimation(this);
        }

    }
    /** dts2md break */
    /**
     * Update the animation.
     */
    update(timeStamp: number) {

        const { _startTimeStamp, _offsetTime, duration } = this;
        const rawProgress = (timeStamp - _startTimeStamp + _offsetTime) / duration;

        if (rawProgress >= 1) {
            this.finish(timeStamp);
            return;
        }

        const event: AnimationUpdateEvent = new Event({
            name: 'update',
            timeStamp,
            stoppable: true,
            cancelable: true,
            data: {
                currentValue: this._currentValue,
                rawProgress: this._rawProgress,
                progress: this._progress,
            },
        });

        this.emit(event as unknown as Utils.ValueType<Events>);

        if (!event.canceled) {
            this._update(rawProgress);
        }

    }

}
