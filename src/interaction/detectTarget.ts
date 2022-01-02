import type { CanvasNode } from '../core/CanvasNode';

/**
 * Detects the interaction target and returns an array
 * representing the path from `rootNode` to the target.
 * (Returns an empty array if there is no interactive target.)
 */
export const detectTarget = (
    rootNode: CanvasNode,
    x: number,
    y: number,
): CanvasNode[] => {

    if (rootNode.penetrable) {
        const { childNodes } = rootNode;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            const path = detectTarget(childNodes[i], x, y);
            if (path.length) {
                path.unshift(rootNode);
                return path;
            }
        }
        return [];
    }

    if (!rootNode.interactive || !rootNode.containsPoint(x, y)) {
        return [];
    }

    const targetPath: CanvasNode[] = [];
    let currentNode: CanvasNode | null = rootNode;
    let nextNode: CanvasNode | null = null;
    let childNodes;

    while (currentNode) {

        targetPath.push(currentNode);

        childNodes = currentNode.childNodes;
        nextNode = null;

        if (childNodes.length) {

            const checkChildNode = (childNode: CanvasNode) => {

                if (nextNode) {
                    return;
                }

                if (childNode.penetrable) {

                    const { childNodes: childChildNodes } = childNode;
                    for (let i = childChildNodes.length - 1; i >= 0; i--) {
                        checkChildNode(childChildNodes[i]);
                        if (nextNode) {
                            break;
                        }
                    }

                } else if (childNode.interactive && childNode.containsPoint(x, y)) {
                    nextNode = childNode;
                }

            };

            for (let i = childNodes.length - 1; i >= 0; i--) {
                checkChildNode(childNodes[i]);
                if (nextNode) {
                    break;
                }
            }

        }

        currentNode = nextNode;

    }

    return targetPath;

};
