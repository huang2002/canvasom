import { NodeConstructor, NodeConstructorParameters } from '../common/registry';
import type { CanvasNode } from '../core/CanvasNode';

/**
 * Create a node from the given arguments.
 */
export const create = <ConstructorType extends NodeConstructor = NodeConstructor>(
    constructor: ConstructorType,
    options?: NodeConstructorParameters<ConstructorType> | null,
    childNodes?: CanvasNode<any>[],
) => {

    const node = new constructor(options ?? undefined);

    if (childNodes && childNodes.length) {
        childNodes.forEach(childNode => {
            node.appendChild(childNode);
        });
    }

    return node as InstanceType<ConstructorType>;

};
