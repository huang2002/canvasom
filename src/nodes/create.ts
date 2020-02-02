import { Node } from './Node';
import { Arc } from '../graphics/Arc';
import { Rect } from '../graphics/Rect';
import { Line } from '../graphics/Line';
import { Sector } from '../graphics/Sector';
import { Text } from '../graphics/Text';
import { Root } from './Root';
import { Group } from './Group';
import { Image } from '../graphics/Image';

export type NodeConstructor<T extends Node, U> = new (options: U) => T;

export const registry = new Map<string, NodeConstructor<any, any>>([
    ['arc', Arc],
    ['line', Line],
    ['rect', Rect],
    ['sector', Sector],
    ['text', Text],
    ['image', Image],
    ['root', Root],
    ['group', Group]
]);

export const create = <T extends Node, U>(
    type: string | NodeConstructor<T, U>,
    options: U,
    ...childNodes: Node[]
): T => {
    const constructor = typeof type === 'string' ? registry.get(type.toLowerCase())! : type,
        node = new constructor(options);
    if (childNodes.length) {
        childNodes.forEach(childNode => {
            node.appendChild(childNode);
        });
    }
    return node;
};
