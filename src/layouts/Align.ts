import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';

export type AlignPositionX = 'left' | 'center' | 'right';
/** dts2md break */
export type AlignPositionY = 'top' | 'middle' | 'bottom';
/** dts2md break */
export type AlignDirection = 'x' | 'y' | 'both';
/** dts2md break */
export type AlignOptions = NodeOptions & Partial<{
    positionX: AlignPositionX;
    positionY: AlignPositionY;
    direction: AlignDirection;
    width: number;
    height: number;
}>;
/** dts2md break */
/**
 * A type of container that aligns its
 * child nodes according to given options
 */
export class Align extends Node implements Required<AlignOptions> {

    /** dts2md break */
    static defaults: AlignOptions = {
        positionX: 'left',
        positionY: 'top',
        direction: 'x',
        width: 0,
        height: 0,
    };

    /** dts2md break */
    constructor(options?: Readonly<AlignOptions>) {
        super();
        Object.assign(this, Align.defaults, options);
    }

    /** dts2md break */
    readonly tag = 'align';
    /** dts2md break */
    /**
     * The aligning positions
     * @defaults 'left'/'top'
     */
    positionX!: AlignPositionX;
    positionY!: AlignPositionY;
    /** dts2md break */
    /**
     * The direction in which child
     * nodes should be aligned
     * @default 'x'
     */
    direction!: AlignDirection;
    /** dts2md break */
    /**
     * The container size
     */
    width!: number;
    height!: number;
    /** dts2md break */
    protected _flexible = true;

    /** dts2md break */
    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    /** dts2md break */
    align() {
        const { direction, childNodes } = this,
            alignX = direction === 'x' || direction === 'both',
            alignY = direction === 'y' || direction === 'both';
        if (alignX) {
            const { left } = this;
            switch (this.positionX) {
                case 'left': {
                    for (let i = 0; i < childNodes.length; i++) {
                        const childNode = childNodes[i];
                        childNode.left = left + childNode.x;
                    }
                    break;
                }
                case 'center': {
                    const center = left + this.width / 2;
                    for (let i = 0; i < childNodes.length; i++) {
                        const childNode = childNodes[i];
                        childNode.left = center - childNode.bounds.width / 2 + childNode.x;
                    }
                    break;
                }
                case 'right': {
                    const right = left + this.width;
                    for (let i = 0; i < childNodes.length; i++) {
                        const childNode = childNodes[i];
                        childNode.left = right - childNode.bounds.width + childNode.x;
                    }
                    break;
                }
            }
        }
        if (alignY) {
            const { top } = this;
            switch (this.positionY) {
                case 'top': {
                    for (let i = 0; i < childNodes.length; i++) {
                        const childNode = childNodes[i];
                        childNode.top = top + childNode.y;
                    }
                    break;
                }
                case 'middle': {
                    const middle = top + this.height / 2;
                    for (let i = 0; i < childNodes.length; i++) {
                        const childNode = childNodes[i];
                        childNode.top = middle - childNode.bounds.height / 2 + childNode.y;
                    }
                    break;
                }
                case 'bottom': {
                    const bottom = top + this.height;
                    for (let i = 0; i < childNodes.length; i++) {
                        const childNode = childNodes[i];
                        childNode.top = bottom - childNode.bounds.height + childNode.y;
                    }
                    break;
                }
            }
        }
    }

    /** dts2md break */
    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

}
