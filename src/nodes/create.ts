import { Node } from './Node';
import { Arc } from '../graphics/Arc';
import { Rect } from '../graphics/Rect';
import { Line } from '../graphics/Line';
import { Sector } from '../graphics/Sector';
import { Text } from '../graphics/Text';
import { Root } from './Root';
import { Group } from './Group';
import { Image } from '../graphics/Image';
import { Scroll } from '../layouts/Scroll';
import { Align } from '../layouts/Align';
import { Flow } from '../layouts/Flow';
import { Grid } from '../layouts/Grid';

export type NodeConstructor<T extends Node, U> = new (options: U) => T;
/** dts2md break */
/**
 * The node registry that maps node tags to their constructors
 * Initial map:
 * - 'arc' -> Arc
 * - 'line' -> Line
 * - 'rect' -> Rect
 * - 'sector' -> Sector
 * - 'text' -> Text
 * - 'image' -> Image
 * - 'root' -> Root
 * - 'group' -> Group
 * - 'scroll' -> Scroll
 * - 'align' -> Align
 * - 'flow' -> Flow
 * - 'grid' -> Grid
 */
export const registry = new Map<string, NodeConstructor<any, any>>([
    ['arc', Arc],
    ['line', Line],
    ['rect', Rect],
    ['sector', Sector],
    ['text', Text],
    ['image', Image],
    ['root', Root],
    ['group', Group],
    ['scroll', Scroll],
    ['align', Align],
    ['flow', Flow],
    ['grid', Grid],
]);
/** dts2md break */
/**
 * Create a node of the given type
 * @example
 * ```js
 * const root = COM.create('root', {
 *     width: 480,
 *     height: 320
 * }, [
 *     COM.create('text', {
 *         data: 'hello, world!',
 *         style: {
 *             fillStyle: '#000'
 *         }
 *     })
 * ]);
 * ```
 */
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
