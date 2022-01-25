/**
 * Type of vector-like objects.
 */
export interface VectorLike {
    /** dts2md break */
    /**
     * The x component of the vector.
     */
    x: number;
    /** dts2md break */
    /**
     * The y component of the vector.
     */
    y: number;
}
/** dts2md break */
/**
 * The class of 2D vectors.
 */
export class Vector {
    /** dts2md break */
    /**
     * Create a vector from a vector-like object.
     */
    static from(vector: VectorLike) {
        return new Vector(vector.x, vector.y);
    }
    /** dts2md break */
    /**
     * Constructor of {@link Vector}.
     */
    constructor();
    /** dts2md break */
    /**
     * Constructor of {@link Vector}.
     */
    constructor(x: number, y: number);
    /** dts2md break */
    /**
     * Constructor of {@link Vector}.
     */
    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }
    /** dts2md break */
    /**
     * The x component of the vector.
     */
    x: number;
    /** dts2md break */
    /**
     * The y component of the vector.
     */
    y: number;
    /** dts2md break */
    /**
     * Get the norm of the vector.
     */
    get norm(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    /** dts2md break */
    /**
     * Set the norm of the vector.
     */
    set norm(targetNorm: number) {
        if (targetNorm === 0) {
            this.x = 0;
            this.y = 0;
        } else {
            const { norm: currentNorm } = this;
            if (currentNorm === 0) {
                throw new Error('cannot scale a zero vector to a nonzero vector');
            }
            this.scale(targetNorm / currentNorm);
        }
    }
    /** dts2md break */
    /**
     * Get a copy of this vector.
     */
    clone() {
        return new Vector(this.x, this.y);
    }
    /** dts2md break */
    /**
     * Add (dx, dy) to the vector.
     */
    add(dx: number, dy: number): this {
        this.x += dx;
        this.y += dy;
        return this;
    }
    /** dts2md break */
    /**
     * Add the given vector to this vector.
     */
    addVector(vector: VectorLike): this {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    /** dts2md break */
    /**
     * Scale the vector.
     */
    scale(scale: number): this;
    /** dts2md break */
    /**
     * Scale the vector.
     */
    scale(scaleX: number, scaleY: number): this;
    /** dts2md break */
    /**
     * Scale the vector.
     * (Default `scaleY`: `scaleX`)
     */
    scale(scaleX: number, scaleY = scaleX): this {
        this.x *= scaleX;
        this.y *= scaleY;
        return this;
    }
    /** dts2md break */
    /**
     * Scale the vector by providing a vector (scaleX, scaleY).
     */
    scaleVector(vector: VectorLike): this {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }
    /** dts2md break */
    /**
     * Rotate anticlockwisely by `rad`.
     */
    rotate(rad: number): this {
        const { x, y } = this;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }
    /** dts2md break */
    /**
     * Returns the dot production of `this` and `vector`.
     */
    dot(vector: VectorLike): number {
        return this.x * vector.x + this.y * vector.y;
    }
    /** dts2md break */
    /**
     * Returns the cross production of `this` and `vector`.
     */
    cross(vector: VectorLike): number {
        return this.x * vector.y - this.y * vector.x;
    }

}
