import { Node } from './Node';
import { Arc } from '../graphics/Arc';
import { Rect } from '../graphics/Rect';
import { Line } from '../graphics/Line';
import { Sector } from '../graphics/Sector';
import { Text } from '../graphics/Text';
import { Root } from './Root';
import { Group } from './Group';
import { Image } from '../graphics/Image';
import { ScrollView } from '../layouts/ScrollView';
import { Center } from '../layouts/Center';

export type NodeConstructor<T extends Node, U> = new (options: U) => T;

export const registry = new Map<string, NodeConstructor<any, any>>([
    ['arc', Arc],
    ['line', Line],
    ['rect', Rect],
    ['sector', Sector],
    ['text', Text],
    ['image', Image],
    ['root', Root],
    ['group', Group],
    ['scrollview', ScrollView],
    ['center', Center],
]);

export const create = <T extends Node, U>(
    type: string | NodeConstructor<T, U>,
    options: U,
    childNodes?: Node[]
): T => {
    const constructor = typeof type === 'string' ? registry.get(type.toLowerCase())! : type,
        node = new constructor(options);
    if (childNodes) {
        childNodes.forEach(childNode => {
            node.appendChild(childNode);
        });
    }
    return node;
};
