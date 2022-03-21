import { Schedule } from '../common/Schedule';
import type { CanvasNode } from '../core/CanvasNode';
import type { CanvasRoot } from '../core/CanvasRoot';
import { AnimationEvents } from '../index';
import { Animation, AnimationOptions } from '../utils/Animation';
import { Timing, TimingFunction } from '../utils/Timing';

/**
 * Type of options of {@link animate}.
 */
export interface AnimateOptions<TargetType extends CanvasNode<any>> {
    /**
     * The target of the animation.
     */
    target: TargetType;
    /**
     * The key of the property to animate.
     * (The property value must be a number.)
     */
    key: keyof TargetType;
    /**
     * Start value.
     * @default target[key]
     */
    from?: number;
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
     * The root node of the target.
     * (When this is available, `root.updateAndRender`
     * will be invoked automatically on animation update.)
     * @default target.getRoot()
     */
    root?: CanvasRoot<any>;
    /**
     * Start time stamp.
     * @default Schedule.getTimeStamp()
     */
    timeStamp?: number;
}
/** dts2md break */
/**
 * Animate specific property.
 */
export const animate = <TargetType extends CanvasNode<any>>(
    options: AnimateOptions<TargetType>,
) => {

    const { target, key } = options;

    const currentValue = target[key];
    if (typeof currentValue !== 'number') {
        throw new TypeError('expect a numerical property');
    }

    const root = (options.root === undefined) ? target.getRoot() : options.root;

    const animationOptions: Required<AnimationOptions<AnimationEvents>> = {
        from: options.from ?? currentValue,
        to: options.to,
        duration: options.duration ?? 1000,
        timing: options.timing ?? Timing.linear,
        callback: (event) => {
            (target[key] as unknown as number) = event.data.currentValue;
            root?.updateAndRender();
        },
    };

    const animation = new Animation(animationOptions);
    const timeStamp = options.timeStamp ?? Schedule.getTimeStamp();
    animation.start(timeStamp);

    return animation;

};
