import type { CanvasNode } from '../core/CanvasNode';

/**
 * Type of node constructors.
 */
export type NodeConstructor<OptionType = any> =
    new (options?: OptionType) => CanvasNode<any>;
/** dts2md break */
/**
 * Extract type of parameters of the given node constructor.
 */
export type NodeConstructorParameters<Constructor extends NodeConstructor> =
    Constructor extends NodeConstructor<infer T> ? T : never;
/** dts2md break */
/**
 * The registry of canvas node constructors.
 * (tag -> constructor)
 */
export const registry = new Map<string, NodeConstructor>();
