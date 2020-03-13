import { Node } from '../nodes/Node';
import { TimingFunction, Timing } from './Timing';
import { Schedule } from '../common/Schedule';
import { Utils } from '../common/Utils';
import { Event } from '../events/Event';
import { EventTargetOptions, EventTarget } from '../events/EventTarget';

export interface AnimationUpdateEventData<T extends Node> {
    target: T;
    offset: number;
    states: Partial<Record<keyof T, number>>;
}
/** dts2md break */
/**
 * Emits on updating animations (event type: 'update')
 */
export type AnimationUpdateEvent<T extends Node> = Event<AnimationUpdateEventData<T>>;
/** dts2md break */
export interface AnimationStopEventData {
    finished: boolean;
}
/** dts2md break */
/**
 * Emits on animation stopping (event type: 'stop')
 */
export type AnimationStopEvent = Event<AnimationStopEventData>;
/** dts2md break */
export interface AnimationState {
    offset: number;
    value: number;
}
/** dts2md break */
export type AnimationStates<T> = {
    [K in keyof T]?: AnimationState[];
};
/** dts2md break */
export interface AnimationFrame<T> {
    offset: number;
    states: Partial<T>;
}
/** dts2md break */
export type AnimationOptions<T extends Node, U = T> = EventTargetOptions & Partial<{
    target: T | null;
    states: AnimationStates<U>;
    frames: AnimationFrame<U>[];
    duration: number;
    delay: number;
    timing: TimingFunction;
}>;
/** dts2md break */
export class Animation<T extends Node> extends EventTarget
    implements Required<AnimationOptions<T>> {
    /** dts2md break */
    static defaults: AnimationOptions<Node> = {
        target: null,
        duration: 1000,
        delay: 0,
        timing: Timing.linear,
    };
    /** dts2md break */
    constructor(options?: Readonly<AnimationOptions<T>>) {
        super();
        Object.assign(this, Animation.defaults, options);
        if (!this._states) {
            this._states = {};
        }
    }
    /** dts2md break */
    /**
     * Whether the animation is active
     */
    readonly active: boolean = false;
    /** dts2md break */
    /**
     * Last time the animation starts
     */
    readonly startTime: number = 0;
    /** dts2md break */
    /**
     * The offset time (now - startTime - delay - pauseTime)
     */
    readonly offsetTime: number = 0;
    /** dts2md break */
    /**
     * The animation target
     * (the animation won't work without a target)
     * @default null
     */
    target!: T | null;
    /** dts2md break */
    /**
     * @default 1000
     */
    duration!: number;
    /** dts2md break */
    /**
     * @default 0
     */
    delay!: number;
    /** dts2md break */
    /**
     * @default Timing.linear
     */
    timing!: TimingFunction;
    private _states!: AnimationStates<T>;
    private _pauseDelay = 0;
    private _pauseTime = 0;
    /** dts2md break */
    /**
     * Computed state map
     */
    set states(states: AnimationStates<T>) {
        const _states = {} as AnimationStates<T>;
        Object.keys(states).forEach(key => {
            _states[key as keyof T]
                = states[key as keyof T]!.sort((a, b) => a.offset - b.offset);
        });
        this._states = _states;
    }

    get states() {
        return this._states;
    }

    /** dts2md break */
    /**
     * A utility setter that enables you to
     * declare animation states in frame order
     * @example
     * ```js
     * animation.frames = [{
     *     offset: .5,
     *     states: {
     *         // ...
     *     }
     * }, {
     *     offset: 1,
     *     states: {
     *         // ...
     *     }
     * }];
     * ```
     */
    set frames(frames: AnimationFrame<T>[]) {
        const states = {} as AnimationStates<T>;
        frames.sort((a, b) => a.offset - b.offset)
            .forEach(frame => {
                Object.keys(frame.states).forEach(key => {
                    const stateFrame: AnimationState = {
                        offset: frame.offset,
                        value: frame.states[key as keyof T] as unknown as number
                    };
                    if (states[key as keyof T]) {
                        states[key as keyof T]!.push(stateFrame);
                    } else {
                        states[key as keyof T] = [stateFrame];
                    }
                });
            });
        this._states = states;
    }

    /** dts2md break */
    /**
     * Animation controling methods
     */

    start() {
        if (this.active) {
            return;
        }
        (this.active as boolean) = true;
        const now = Date.now();
        if (this._pauseTime) {
            this._pauseDelay += now - this._pauseTime;
        } else {
            (this.startTime as number) = now;
            (this.offsetTime as number) = 0;
            this._pauseTime = 0;
            this._pauseDelay = 0;
        }
        Schedule.registerAnimation(this);
    }

    private _stop(finished: boolean) {
        (this.active as boolean) = false;
        this._pauseTime = 0;
        Schedule.removeAnimation(this);
        this.dispatchEvent(
            new Event<AnimationStopEventData>('stop', {
                data: { finished }
            })
        );
    }

    stop() {
        this._stop(false);
    }

    pause() {
        if (!this.active) {
            return;
        }
        (this.active as boolean) = false;
        this._pauseTime = Date.now();
        Schedule.removeAnimation(this);
    }

    private _update(offset: number) {
        const { target } = this;
        if (!target) {
            return;
        }
        const { _states } = this,
            props = {} as Record<keyof T, number>;
        Object.keys(_states).forEach(key => {
            const frames = _states[key as keyof T]!,
                nextFrameIndex = frames.findIndex(frame => frame.offset >= offset);
            if (nextFrameIndex > 0) {
                const nextFrame = frames[nextFrameIndex],
                    { offset: nextOffset } = nextFrame;
                if (nextOffset === offset) {
                    props[key as keyof T] = nextFrame.value;
                } else {
                    const prevFrame = frames[nextFrameIndex - 1],
                        { offset: prevOffset } = prevFrame;
                    props[key as keyof T] = Utils.mix(
                        prevFrame.value,
                        nextFrame.value,
                        (offset - prevOffset) / (nextOffset - prevOffset)
                    );
                }
            } else if (nextFrameIndex) { // nextFrameIndex === -1
                props[key as keyof T] = frames[frames.length - 1].value;
            } else { // nextFrameIndex === 0
                if (frames[0].offset === offset) {
                    props[key as keyof T] = frames[0].value;
                } else {
                    const initialValue = target[key as keyof T] as unknown as number,
                        nextFrame = frames[0];
                    frames.unshift({ offset: 0, value: initialValue });
                    props[key as keyof T] = Utils.mix(
                        initialValue,
                        nextFrame.value,
                        offset / nextFrame.offset
                    );
                }
            }
        });
        const event = new Event<AnimationUpdateEventData<T>>('update', {
            data: {
                target,
                offset,
                states: props
            }
        });
        this.dispatchEvent(event);
        target.update(props);
        if (offset >= 1) {
            this._stop(true);
        }
        return event;
    }

    finish() {
        this._stop(true);
        this._update(1);
    }

    cancel() {
        this._stop(false);
        this._update(0);
    }

    /** dts2md break */
    /**
     * Update the animation
     * (usually used internally)
     */
    update() {
        const offsetTime = Date.now() - this.startTime - this._pauseDelay - this.delay;
        if (offsetTime < 0) {
            return;
        }
        (this.offsetTime as number) = offsetTime;
        const offset = offsetTime / this.duration;
        this._update(offset < 1 ? this.timing(offset) : 1);
    }

}
