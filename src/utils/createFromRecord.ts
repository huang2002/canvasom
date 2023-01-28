import { registry } from '../common/registry';
import type { CanvasNode } from '../core/CanvasNode';
import { create } from './create';

/**
 * Acceptable value type in node records.
 */
export type NodeRecordValue =
    | string
    | number
    | boolean
    | null
    | NodeRecordValue[]
    | { [key: string]: NodeRecordValue; };
/** dts2md break */
/**
 * Type of options in node record.
 */
export type NodeRecordOptions = Record<string, NodeRecordValue>;
/** dts2md break */
/**
 * Type of node records.
 */
export interface NodeRecord {
    tag: string;
    options: NodeRecordOptions;
    childNodes?: NodeRecord[];
}
/** dts2md break */
/**
 * Create a node from record.
 */
export const createFromRecord = (record: NodeRecord): CanvasNode<any> => {
    const constructor = registry.get(record.tag);
    if (!constructor) {
        throw new TypeError(
            'unknown tag: ' + record.tag
        );
    }
    return create(
        constructor,
        record.options,
        record.childNodes?.map(createFromRecord),
    );
};
