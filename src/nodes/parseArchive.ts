import { Node } from './Node';
import { create } from './create';

export interface NodeArchive {
    tag: string;
    options?: object;
    childNodes?: NodeArchive[];
}
/** dts2md break */
/**
 * Parse the node archive and get the node
 */
export const parseArchive = (archive: NodeArchive): Node => (
    create(
        archive.tag,
        archive.options,
        archive.childNodes && archive.childNodes.map(parseArchive)
    )
);
