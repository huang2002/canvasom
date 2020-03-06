import { Node } from '../nodes/Node';

export class Bounds {

    /** dts2md break */
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;

    get width() {
        return this.right - this.left;
    }

    set width(width: number) {
        this.right = this.left + width;
    }

    get height() {
        return this.bottom - this.top;
    }

    set height(height: number) {
        this.bottom = this.top + height;
    }

    /** dts2md break */
    /**
     * Move the bounds by (dx, dy)
     */
    move(dx: number, dy: number) {
        this.left += dx;
        this.right += dx;
        this.top += dy;
        this.bottom += dy;
    }

    /** dts2md break */
    /**
     * Move the bounds to (x, y)
     */
    moveTo(x: number, y: number) {
        const { width, height } = this;
        this.left = x;
        this.top = y;
        this.right = x + width;
        this.bottom = y + height;
    }

    /** dts2md break */
    /**
     * Adjust the bounds to contain the bounds of the given canvas nodes
     */
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

    /** dts2md break */
    /**
     * Tells whether the given position is inside the bounds
     */
    containsPoint(x: number, y: number) {
        return x >= this.left && x <= this.right
            && y >= this.top && y <= this.bottom;
    }

    /** dts2md break */
    /**
     * Tells whether the given bounds overlaps this bounds
     */
    overlaps(bounds: Bounds) {
        return this.left < bounds.left
            && this.right > bounds.left
            && this.top < bounds.bottom
            && this.bottom > bounds.top;
    }

}
