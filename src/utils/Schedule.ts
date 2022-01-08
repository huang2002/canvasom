import { removeElements } from '3h-utils';
import type { CanvasNode } from '../core/CanvasNode';
import type { CanvasRoot } from '../core/CanvasRoot';

/**
 * Type of time stamp getters.
 */
export type TimeStampGetter = () => void;
/** dts2md break */
/**
 * Schedule-related APIs.
 */
export namespace Schedule {
    /** dts2md break */
    /**
     * Get current time stamp. (mutable)
     */
    export let getTimeStamp = Date.now;

    const _updateList: CanvasNode<any>[] = [];
    const _renderList: CanvasRoot<any>[] = [];

    const _tick = () => {

        _tickTimer = null;

        const timeStamp = getTimeStamp();

        _updateList.forEach(node => {
            node.update(timeStamp);
        });
        _updateList.length = 0;

        _renderList.forEach(root => {
            root.render();
        });
        _renderList.length = 0;

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
