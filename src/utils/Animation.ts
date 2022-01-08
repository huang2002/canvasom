import { interpolate } from '3h-utils';
import { Schedule } from '../common/Schedule';
import { TimingFunction, Timing } from './Timing';

/**
 * Type of animation callback.
 */
export type AnimationCallback = (currentValue: number) => void;
/** dts2md break */
/**
 * Type of options of {@link Animation}.
 */
export interface AnimationOptions {
    /**
     * Start value.
     */
    from: number;
    /**
     * End value.
     */
    to: number;
    /**
     * Duration of animation. (ms)
     * @default 1000
     */
    duration?: number;
    /**
     * The timing function to use.
     * @default Timing.linear
     */
    timing?: TimingFunction;
    /**
     * The callback function
     * that receives current value
     * and responds to it.
     */
    callback: AnimationCallback;
}
/** dts2md break */
/**
 * Class of animations.
 */
export class Animation {
    /** dts2md break */
    /**
     * Constructor of {@link Animation}.
     */
    constructor(options: AnimationOptions) {
        this.from = options.from;
        this.to = options.to;
        this.duration = options.duration ?? 1000;
        this.timing = options.timing ?? Timing.linear;
        this.callback = options.callback;
    }
    /** dts2md break */
    /**
     * Start value.
     */
    from: number;
    /** dts2md break */
    /**
     * End value.
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
     * The callback function
     * that receives current value
     * and responds to it.
     */
    callback: AnimationCallback;

    private _active = false;
    /** dts2md break */
    /**
     * Whether the animation is active.
     */
    get active() {
        return this._active;
    }

    private _startTimeStamp = 0;
    private _pauseTimeStamp = 0;
    private _offsetTime = 0;
    private _finished = true;
    /** dts2md break */
    /**
     * Start the animation.
     * (Executes `Schedule.animate(this)` automatically.)
     */
    start(timeStamp: number) {
        if (this._active) {
            return;
        }
        this._active = true;
        this._finished = false;
        this._startTimeStamp = timeStamp;
        this._offsetTime = 0;
        Schedule.animate(this);
    }
    /** dts2md break */
    /**
     * Stop the animation.
     * (Executes `Schedule.cancelAnimation(this)` automatically.)
     */
    stop(timeStamp: number) {
        if (!this._active || this._finished) {
            return;
        }
        this._active = false;
        this._pauseTimeStamp = timeStamp;
        Schedule.cancelAnimation(this);
    }
    /** dts2md break */
    /**
     * Resume the animation.
     * (Executes `Schedule.animate(this)` automatically.)
     */
    resume(timeStamp: number) {
        if (this._active || this._finished) {
            return;
        }
        this._active = true;
        this._offsetTime += this._pauseTimeStamp - timeStamp;
        Schedule.animate(this);
    }
    /** dts2md break */
    /**
     * Finish the animation.
     * (Executes `Schedule.cancelAnimation(this)` automatically.)
     */
    finish() {

        if (this._finished) {
            return;
        }

        const { from, to, timing, callback } = this;
        const endValue = interpolate(from, to, timing(1));
        callback(endValue);

        this._active = false;
        this._finished = true;
        Schedule.cancelAnimation(this);

    }
    /** dts2md break */
    /**
     * Update the animation.
     */
    update(timeStamp: number) {

        const { _startTimeStamp, _offsetTime, duration } = this;
        const progress = (timeStamp - _startTimeStamp + _offsetTime) / duration;

        if (progress >= 1) {
            this.finish();
            return;
        }

        const { from, to, timing, callback } = this;
        const currentValue = interpolate(from, to, timing(progress));

        callback(currentValue);

    }

}
