import { Vector } from "./Vector";
import { Utils } from "./Utils";

/**
 * Vertex-related APIs.
 */
export namespace Vertices {
    /** dts2md break */
    /**
     * Create vertices from a number array.
     * (Expect: [x0, y0, x1, y1, ...])
     */
    export const fromArray = (array: number[]): Vector[] => {

        if (array.length & 1) { // odd
            throw new RangeError('expect the array length to be even');
        }

        const result = [];
        for (let i = 0; i < array.length; i++) {
            result.push(
                new Vector(array[i], array[i + 1])
            );
        }
        return result;

    };
    /** dts2md break */
    /**
     * Create vertices of a regular polygon.
     * (Default start angle: `-Utils.Constants.HALF_PI`)
     */
    export const createRegularPolygon = (
        edges: number,
        radius: number,
        startAngle = -Utils.Constants.HALF_PI,
    ): Vector[] => {
        const { cos, sin } = Math;
        const result = [];
        const deltaAngle = Utils.Constants.TWO_PI / edges;
        let angle = startAngle;
        for (let i = 0; i < edges; i++) {
            result.push(
                new Vector(
                    radius * cos(angle),
                    radius * sin(angle),
                )
            );
            angle += deltaAngle;
        }
        return result;
    };
    /** dts2md break */
    /**
     * Create vertices of a star-like polygon.
     * (Default start angle: `Utils.Constants.HALF_PI`)
     */
    export const createStar = (
        angles: number,
        innerRadius: number,
        outerRadius: number,
        startAngle = Utils.Constants.HALF_PI,
    ): Vector[] => {

        const { cos, sin } = Math;
        const deltaAngle = Math.PI / angles;
        const result = [];
        let angle = startAngle;

        for (let i = 0; i < angles; i++) {

            result.push(
                new Vector(
                    innerRadius * cos(angle),
                    innerRadius * sin(angle) ,
                )
            );
            angle += deltaAngle;

            result.push(
                new Vector(
                    outerRadius * cos(angle),
                    outerRadius * sin(angle) ,
                )
            );
            angle += deltaAngle;

        }

        return result;

    };
    /** dts2md break */
    /**
     * Create vertices of a rectangle.
     * (Default rotation: 0)
     */
    export const createRectangle = (
        width: number,
        height: number,
        rotation?: number,
    ): Vector[] => {

        const x0 = width / 2;
        const y0 = height / 2;

        if (rotation) {

            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            const x1 = x0 * cos - y0 * sin;
            const y1 = x0 * sin + y0 * sin;
            const x2 = -x0 * cos - y0 * sin;
            const y2 = -x0 * sin + y0 * sin;

            return [
                new Vector(x1, y1),
                new Vector(x2, y2),
                new Vector(-x1, -y1),
                new Vector(-x2, -y2),
            ];

        } else {

            return [
                new Vector(x0, y0),
                new Vector(-x0, y0),
                new Vector(-x0, -y0),
                new Vector(x0, -y0),
            ];

        }

    };

}
