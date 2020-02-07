import { Node, NodeOptions } from '../nodes/Node';
import { Utils } from '../common/Utils';
import { WheelEvent, PointerEvent } from '../nodes/Root';
import { Event } from '../events/Event';

export interface ScrollEventData {
    deltaX: number;
    deltaY: number;
}

export type ScrollEvent = Event<ScrollEventData>;

export interface ScrollViewOptions extends NodeOptions {
    horizontal?: boolean;
    vertical?: boolean;
    width: number;
    height: number;
    pixelScale?: number;
    lineScale?: number;
    pageScale?: number;
}

export class ScrollView extends Node implements Required<ScrollViewOptions> {

    static defaults: Partial<ScrollViewOptions> = {
        interactive: true,
        horizontal: false,
        vertical: false,
        pixelScale: 1,
        lineScale: 25,
        pageScale: 300,
    };

    constructor(options: Readonly<ScrollViewOptions>) {
        super();
        Object.assign(this, ScrollView.defaults, options);
        if (Utils.Const.IS_TOUCH_MODE) {
            this.addListener('pointerdown', this._onPointerDown.bind(this));
            this.addListener('pointermove', this._onPointerMove.bind(this));
            this.addListener('pointerup', this._onPointerUp.bind(this));
        } else {
            this.addListener('wheel', this._onWheel.bind(this));
        }
    }

    readonly tag = 'scrollview';
    readonly offsetX: number = 0;
    readonly offsetY: number = 0;
    readonly offsetWidth: number = 0;
    readonly offsetHeight: number = 0;
    horizontal!: boolean;
    vertical!: boolean;
    width!: number;
    height!: number;
    pixelScale!: number;
    lineScale!: number;
    pageScale!: number;
    private _isDragging = false;
    private _lastX = 0;
    private _lastY = 0;

    protected _compute() {
        const { childNodes, bounds } = this;
        bounds.width = this.width;
        bounds.height = this.height;
        (this.left as number) -= this.offsetX;
        (this.top as number) -= this.offsetY;
        childNodes.forEach(childNode => {
            childNode.compute();
        });
        bounds.contain(childNodes);
        (this.offsetWidth as number) = bounds.right - this.left;
        (this.offsetHeight as number) = bounds.bottom - this.top;
    }

    containsPoint(x: number, y: number) {
        return this.bounds.containsPoint(x, y);
    }

    protected _render(context: CanvasRenderingContext2D) {
        Utils.renderNodes(this.childNodes, context);
    }

    scrollBy(deltaX: number, deltaY: number) {
        const { offsetX: _offsetX, offsetY: _offsetY } = this,
            offsetX = Utils.clamp(_offsetX + deltaX, 0, this.offsetWidth - this.width),
            offsetY = Utils.clamp(_offsetY + deltaY, 0, this.offsetHeight - this.height),
            dx = offsetX - _offsetX,
            dy = offsetY - _offsetY;
        this.update({ offsetX, offsetY });
        this.dispatchEvent(
            new Event<ScrollEventData>('scroll', {
                cancelable: true,
                target: this,
                data: {
                    deltaX: dx,
                    deltaY: dy
                }
            })
        );
    }

    scrollTo(x: number, y: number) {
        this.scrollBy(x - this.offsetX, y - this.offsetY);
    }

    private _onWheel(event: WheelEvent) {
        if (event.defaultPrevented) {
            return;
        }
        const { deltaX, deltaY } = event.data;
        let scale = 1;
        switch (event.data.deltaMode) {
            case 0: {
                scale = this.pixelScale;
                break;
            }
            case 1: {
                scale = this.lineScale;
                break;
            }
            case 2: {
                scale = this.pageScale;
                break;
            }
        }
        this.scrollBy(
            this.horizontal ? deltaX * scale : 0,
            this.vertical ? deltaY * scale : 0
        );
    }

    private _onPointerDown(event: PointerEvent) {
        if (!event.defaultPrevented) {
            this._isDragging = true;
            this._lastX = event.data.x;
            this._lastY = event.data.y;
        }
    }

    private _onPointerMove(event: PointerEvent) {
        if (this._isDragging && !event.defaultPrevented) {
            const { x, y } = event.data;
            this.scrollBy(
                this.horizontal ? this._lastX - x : 0,
                this.vertical ? this._lastY - y : 0
            );
            this._lastX = x;
            this._lastY = y;
        }
    }

    private _onPointerUp() {
        this._isDragging = false;
    }

}
