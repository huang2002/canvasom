import { Node } from '../nodes/Node';
import { Root } from '../nodes/Root';
import { Utils } from './Utils';
import { Animation } from '../animation/Animation';

export type ScheduleCallback = () => void;
/** dts2md break */
export namespace Schedule {

    const _animations = new Array<Animation<Node>>(),
        _nextTickCallbacks = new Array<ScheduleCallback>();
    let _expiredNodes = new Array<Node>(),
        _willTick = false;

    const _tick = () => {
        _willTick = false;

        /* update animation */
        _animations.forEach(animation => {
            animation.update();
        });

        /* filter child nodes */
        const _nodes = new Array<Node | null>();
        _expiredNodes.forEach(current => {
            for (let i = 0; i < _nodes.length; i++) {
                const node = _nodes[i];
                if (!node) {
                    continue;
                }
                if (node.contains(current)) {
                    return;
                }
                if (current.contains(node)) {
                    for (let j = i + 1; j < _nodes.length; j++) {
                        if (_nodes[j] && current.contains(_nodes[j])) {
                            _nodes[j] = null;
                        }
                    }
                    _nodes[i] = current;
                    return;
                }
            }
            _nodes.push(current);
        });
        _expiredNodes.length = 0;

        /* get actual nodes */
        const nodes = _nodes.filter(Boolean) as Node[];

        /* update nodes */
        nodes.forEach(node => {
            node.compute();
        });

        /* compose roots in ascending order */
        const roots = new Array<Root>();
        nodes.forEach(node => {
            Utils.getRoots(node).forEach(root => {
                if (!roots.includes(root)) {
                    roots.push(root);
                }
            });
        });
        roots.sort(
            (rootA, rootB) => rootB.contains(rootA) ? -1 : 1
        ).forEach(root => {
            root.compose();
        });

        /* resolve nextTick callbacks */
        const callbacks = _nextTickCallbacks.slice(0);
        _nextTickCallbacks.length = 0;
        callbacks.forEach(callback => {
            callback();
        });

    };

    const _requestTick = () => {
        if (!_willTick) {
            _willTick = true;
            requestAnimationFrame(_tick);
        }
    };

    /** dts2md break */
    /**
     * Mark a node as expired (usually used internally)
     */
    export const mark = (node: Node) => {
        if (!_expiredNodes.includes(node)) {
            _expiredNodes.push(node);
            _requestTick();
        }
    };

    /**
     * Unmark an node and its child nodes
     * (you can use this to cancel the updating of
     * a node and its child nodes for some purpose)
     */
    export const unmark = (node: Node) => {
        _expiredNodes = _expiredNodes.filter(expiredNode => !node.contains(expiredNode));
    };

    /** dts2md break */
    export type NextTick =
        | ((callback: ScheduleCallback) => void)
        | (() => Promise<void>);

    /** dts2md break */
    /**
     * Register a callback that will be invoked when
     * next tick is about to end; or, get a promise
     * that will be resolved at that time
     * (after all updates are finished)
     */
    export const nextTick: NextTick = (callback?: ScheduleCallback) => {
        if (callback) {
            _nextTickCallbacks.push(callback);
        } else {
            return new Promise<void>(resolve => {
                _nextTickCallbacks.push(resolve);
            });
        }
        _requestTick();
    };

    /** dts2md break */
    /**
     * Register an animation
     * (animations are automatically registered in `animation.start`)
     */
    export const registerAnimation = (animation: Animation<any>) => {
        if (!_animations.includes(animation)) {
            _animations.push(animation);
            _requestTick();
        }
    };

    /** dts2md break */
    /**
     * Remove an animation
     * (animations are automatically removed when stopped)
     */
    export const removeAnimation = (animation: Animation<any>) => {
        const index = _animations.indexOf(animation);
        if (~index) {
            Utils.removeIndex(_animations, index);
        }
    };

}
