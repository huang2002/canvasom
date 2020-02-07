import { Node } from '../nodes/Node';
import { Root } from '../nodes/Root';
import { Utils } from './Utils';

export namespace Schedule {

    const _nextTickCallbacks = new Array<() => void>();
    let _expiredNodes = new Array<Node>(),
        _willTick = false;

    const _tick = () => {
        _willTick = false;

        // filter child nodes
        const nodes = new Array<Node>();
        _expiredNodes.forEach(node => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].contains(node)) {
                    return;
                }
                if (node.contains(nodes[i])) {
                    nodes[i] = node;
                    return;
                }
            }
            nodes.push(node);
        });
        _expiredNodes.length = 0;

        // update nodes
        nodes.forEach(node => {
            node.compute();
        });

        // compose roots in ascending order
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

        // resolve nextTick callbacks
        _nextTickCallbacks.forEach(callback => {
            callback();
        });
        _nextTickCallbacks.length = 0;

    };

    const _requestTick = () => {
        if (!_willTick) {
            _willTick = true;
            requestAnimationFrame(_tick);
        }
    };

    export const mark = (node: Node) => {
        if (!_expiredNodes.includes(node)) {
            _expiredNodes.push(node);
            _requestTick();
        }
    };

    export const unmark = (node: Node) => {
        _expiredNodes = _expiredNodes.filter(expiredNode => !node.contains(expiredNode));
    };

    export const nextTick = () => new Promise<void>(resolve => {
        _nextTickCallbacks.push(resolve);
        _requestTick();
    });

}
