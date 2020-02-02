import { Node } from '../nodes/Node';
import { Root } from '../nodes/Root';
import { Utils } from './Utils';

export namespace Schedule {

    const _expiredNodes = new Array<Node>();
    let _willTick = false;

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
            const root = Utils.getRoot(node);
            if (root && !roots.includes(root)) {
                roots.push(root);
            }
            if (node instanceof Root) {
                roots.push(node);
            }
        });
        roots.sort(
            (rootA, rootB) => rootB.contains(rootA) ? -1 : 1
        ).forEach(root => {
            root.compose();
        });

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
        const index = _expiredNodes.indexOf(node);
        if (~index) {
            Utils.removeIndex(_expiredNodes, index);
        }
    };

}
