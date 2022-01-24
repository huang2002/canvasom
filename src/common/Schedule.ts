import { removeElements } from '3h-utils';
import type { CanvasNode } from '../core/CanvasNode';
import type { CanvasRoot } from '../core/CanvasRoot';
import type { Animation } from '../utils/Animation';

/**
 * Type of time stamp getters.
 */
export type TimeStampGetter = () => void;
/** dts2md break */
/**
 * Schedule-related APIs.
 * (For each tick, update animations,
 * update nodes, and render the roots.)
 */
export namespace Schedule {
    /** dts2md break */
    /**
     * Get current time stamp. (mutable)
     */
    export let getTimeStamp = Date.now;

    let _animationList: Animation[] = [];
    const _updateList: CanvasNode<any>[] = [];
    const _renderList: CanvasRoot<any>[] = [];

    const _tick = () => {

        _tickTimer = null;

        const timeStamp = getTimeStamp();

        const animationList = _animationList.slice();
        const updateList = _updateList.slice();
        const renderList = _renderList.slice();

        _updateList.length = 0;
        _renderList.length = 0;

        animationList.forEach(animation => {
            animation.update(timeStamp);
        });

        updateList.forEach(node => {
            node.updateSync(timeStamp);
        });

        renderList.forEach(root => {
            root.renderSync();
        });

        _animationList = _animationList.filter(
            animation => animation.active
        );

        if (_animationList.length) {
            _requestTick();
        }

    };

    let _tickTimer: number | null = null;

    const _requestTick = () => {
        if (_tickTimer === null) {
            _tickTimer = requestAnimationFrame(_tick);
        }
    };

    const _checkTick = () => {
        if (
            (_tickTimer !== null)
            && !_updateList.length
            && !_renderList.length
        ) {
            cancelAnimationFrame(_tickTimer);
            _tickTimer = null;
        }
    };
    /** dts2md break */
    /**
     * Add the given animation to update list.
     * (The animation will be updated asynchronously.)
     */
    export const animate = (animation: Animation) => {
        if (!_animationList.includes(animation)) {
            _animationList.push(animation);
            _requestTick();
        }
    };
    /** dts2md break */
    /**
     * Remove the given animation from update list.
     */
    export const cancelAnimation = (animation: Animation) => {
        const index = _animationList.indexOf(animation);
        if (index === -1) {
            return;
        }
        removeElements(_animationList, index, 1);
        _checkTick();
    };
    /** dts2md break */
    /**
     * Add the given node to update list.
     * (The node will be updated asynchronously.)
     */
    export const update = (node: CanvasNode<any>) => {
        if (!_updateList.includes(node)) {
            _updateList.push(node);
            _requestTick();
        }
    };
    /** dts2md break */
    /**
     * Remove the given node from update list.
     */
    export const cancelUpdate = (node: CanvasNode<any>) => {
        const index = _updateList.indexOf(node);
        if (index === -1) {
            return;
        }
        removeElements(_updateList, index, 1);
        _checkTick();
    };
    /** dts2md break */
    /**
     * Add the given root to render list.
     * (The root will be rendered asynchronously.)
     */
    export const render = (root: CanvasRoot<any>) => {
        if (!_renderList.includes(root)) {
            _renderList.push(root);
            _requestTick();
        }
    };
    /** dts2md break */
    /**
     * Remove the given root from render list.
     */
    export const cancelRender = (root: CanvasRoot<any>) => {
        const index = _renderList.indexOf(root);
        if (index === -1) {
            return;
        }
        removeElements(_renderList, index, 1);
        _checkTick();
    };
    /** dts2md break */
    /**
     * Add the given root to both update list and render list.
     * (The root will be rendered asynchronously.)
     */
    export const updateAndRender = (root: CanvasRoot<any>) => {

        let added = false;

        if (!_updateList.includes(root)) {
            _updateList.push(root);
            added = true;
        }

        if (!_renderList.includes(root)) {
            _renderList.push(root);
            added = true;
        }

        if (added) {
            _requestTick();
        }

    };
    /** dts2md break */
    /**
     * Remove the given root from both update list and render list.
     */
    export const cancelUpdateAndRender = (root: CanvasRoot<any>) => {

        let removed = false;

        const updateIndex = _updateList.indexOf(root);
        if (updateIndex !== -1) {
            removeElements(_updateList, updateIndex, 1);
            removed = true;
        }

        const renderIndex = _renderList.indexOf(root);
        if (renderIndex !== -1) {
            removeElements(_renderList, renderIndex, 1);
            removed = true;
        }

        if (removed) {
            _checkTick();
        }

    };

}
