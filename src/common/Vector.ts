import { random } from '3h-utils';
import { Utils } from "./Utils";

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
     * Get a random normalized vector.
     * (Default `startAngle`: 0; `endAngle`: )
     */
    static random(startAngle = 0, endAngle = Utils.Constants.TWO_PI) {
        const angle = random(startAngle, endAngle);
        return new Vector(
            Math.cos(angle),
            Math.sin(angle),
        );
    }
    /** dts2md break */
    /**
     * vector1 += vector0 * (k1 / (Math.abs(k1) + Math.abs(k2))) * scale
     * vector2 += vector0 * (k2 / (Math.abs(k1) + Math.abs(k2))) * scale
     * (Default scale: 1)
     */
    static distribute(
        vector0: VectorLike,
        vector1: VectorLike,
        vector2: VectorLike,
        k1: number,
        k2: number,
        scale?: number,
    ) {
        let sum = Math.abs(k1) + Math.abs(k2);
        if (scale !== undefined) {
            sum /= scale;
        }
        k1 /= sum;
        k2 /= sum;
        vector1.x += vector0.x * k1;
        vector1.y += vector0.y * k1;
        vector2.x += vector0.x * k2;
        vector2.y += vector0.y * k2;
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
     * Normalize the vector.
     */
    normalize(): this {
        this.norm = 1;
        return this;
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
     * Subtract (dx, dy) from the vector.
     */
    sub(dx: number, dy: number): this {
        this.x -= dx;
        this.y -= dy;
        return this;
    }
    /** dts2md break */
    /**
     * Subtract the given vector from this vector.
     */
    subVector(vector: VectorLike): this {
        this.x -= vector.x;
        this.y -= vector.y;
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
     * Reverse the vector.
     * ((x, y) -> (-x, -y))
     */
    reverse(): this {
        this.x = -this.x;
        this.y = -this.y;
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
     * Rotate the vector by 90 degrees.
     * (Default direction: anticlockwise)
     */
    tangent(clockwise = false): this {
        const { x, y } = this;
        if (clockwise) {
            this.x = y;
            this.y = -x;
        } else {
            this.x = -y;
            this.y = x;
        }
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
    /** dts2md break */
    /**
     * Get the projection of this vector on specific direction.
     */
    project(direction: VectorLike): number {
        const dotProduct = this.x * direction.x + this.y * direction.y;
        const directionNorm = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        return dotProduct / directionNorm;
    }
    /** dts2md break */
    /**
     * Get the vector projection of this vector on specific direction.
     */
    projectVector(direction: VectorLike): Vector {
        const dotProduct = this.x * direction.x + this.y * direction.y;
        const directionNorm = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        return Vector.from(direction)
            .scale(dotProduct / directionNorm);
    }
    /** dts2md break */
    /**
     * @override Object.toString
     */
    toString(fractionDigits?: number) {
        return this.x.toFixed(fractionDigits) + ',' + this.y.toFixed(fractionDigits);
    }

}
