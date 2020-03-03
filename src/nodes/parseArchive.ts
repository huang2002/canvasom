import { Node } from './Node';
import { create } from './create';

export interface NodeArchive {
    tag: string;
    options?: object;
    childNodes?: NodeArchive[];
}

export const parseArchive = (archive: NodeArchive): Node => (
    create(
        archive.tag,
        archive.options,
        archive.childNodes && archive.childNodes.map(parseArchive)
    )
);
