/**
 * The class of node bounds.
 */
export class Bounds {
    /** dts2md break */
    /**
     * The left most of the bounds.
     */
    left = 0;
    /** dts2md break */
    /**
     * The top most of the bounds.
     */
    top = 0;
    /** dts2md break */
    /**
     * The width of the bounds.
     */
    width = 0;
    /** dts2md break */
    /**
     * The height of the bounds.
     */
    height = 0;
    /** dts2md break */
    /**
     * Get the right most of the bounds.
     */
    get right() {
        return this.left + this.width;
    }
    /** dts2md break */
    /**
     * Set the right most of the bounds.
     */
    set right(right: number) {
        this.left = right - this.width;
    }
    /** dts2md break */
    /**
     * Get the bottom most of the bounds.
     */
    get bottom() {
        return this.top + this.height;
    }
    /** dts2md break */
    /**
     * Set the bottom most of the bounds.
     */
    set bottom(bottom: number) {
        this.top = bottom - this.height;
    }
    /** dts2md break */
    /**
     * Returns `true` if the given position is inside the bounds.
     */
    containsPoint(x: number, y: number) {
        return (x >= this.left)
            && (x <= (this.left + this.width))
            && (y >= this.top)
            && (y <= (this.top + this.height));
    }
    /** dts2md break */
    /**
     * Returns `true` the given bounds overlaps this one.
     */
    overlaps(bounds: Bounds) {
        return (this.left < (bounds.left + bounds.width))
            && ((this.left + this.width) > bounds.left)
            && (this.top < (bounds.top + bounds.height))
            && ((this.top + this.height) > bounds.top);
    }

}
