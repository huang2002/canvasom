import { Node } from '../nodes/Node';

/**
 * Find out which node is the target of the point at the given position
 * (using `node.containsPoint` internally)
 * @param interactive Whether to check `node.interactive`
 * @returns The last node that contains the point
 * if there is one; null otherwise
 */
export const detectTarget = (
    nodes: Node[],
    x: number,
    y: number,
    interactive?: boolean
): Node | null => {
    if (interactive) {
        let target = detectTarget(nodes, x, y);
        while (target) {
            if (target.interactive) {
                return target;
            }
            target = target.parentNode;
        }
        return null;
    }
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (node.penetrable) {
            const target = node.childNodes.length
                && detectTarget(node.childNodes, x, y);
            if (target) {
                return target;
            } else {
                continue;
            }
        }
        if (node.containsPoint && node.containsPoint(x, y)) {
            if (node.childNodes.length) {
                const target = detectTarget(node.childNodes, x, y);
                if (target) {
                    return target;
                }
            }
            return node;
        }
    }
    return null;
};
