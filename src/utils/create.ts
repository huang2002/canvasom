import type { CanvasNode } from '../core/CanvasNode';

/**
 * Type of node constructors.
 */
export type NodeConstructor<OptionType = any> =
    new (options?: OptionType) => CanvasNode;
/** dts2md break */
/**
 * Extract type of parameters of the given node constructor.
 */
export type NodeConstructorParameters<Constructor extends NodeConstructor> =
    Constructor extends NodeConstructor<infer T> ? T : never;
/** dts2md break */
/**
 * Create a node from the given arguments.
 */
export const create = <ConstructorType extends NodeConstructor = NodeConstructor>(
    constructor: ConstructorType,
    options?: NodeConstructorParameters<ConstructorType> | null,
    childNodes?: CanvasNode[],
) => {

    const node = new constructor(options ?? undefined);

    if (childNodes && childNodes.length) {
        childNodes.forEach(childNode => {
            node.appendChild(childNode);
        });
    }

    return node as InstanceType<ConstructorType>;

};
