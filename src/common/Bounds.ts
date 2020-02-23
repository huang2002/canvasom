import { Node } from '../nodes/Node';

export class Bounds {

    top = 0;
    right = 0;
    bottom = 0;
    left = 0;

    get width() {
        return this.right - this.left;
    }

    get height() {
        return this.bottom - this.top;
    }

    set width(width: number) {
        this.right = this.left + width;
    }

    set height(height: number) {
        this.bottom = this.top + height;
    }

    move(dx: number, dy: number) {
        this.left += dx;
        this.right += dx;
        this.top += dy;
        this.bottom += dy;
    }

    moveTo(x: number, y: number) {
        const { width, height } = this;
        this.left = x;
        this.top = y;
        this.right = x + width;
        this.bottom = y + height;
    }

    contain(nodes: Node[]) {
        if (!nodes.length) {
            return;
        }
        let { left, right, top, bottom } = this;
        nodes.forEach(node => {
            const { bounds } = node;
            if (bounds.left < left) {
                left = bounds.left;
            }
            if (bounds.right > right) {
                right = bounds.right;
            }
            if (bounds.top < top) {
                top = bounds.top;
            }
            if (bounds.bottom > bottom) {
                bottom = bounds.bottom;
            }
        });
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    containsPoint(x: number, y: number) {
        return x >= this.left && x <= this.right
            && y >= this.top && y <= this.bottom;
    }

}
