import { ShapeNode, ShapeNodeOptions } from "./ShapeNode";
import { CanvasNodeEvents } from '../core/CanvasNode';
import { Vector } from '../common/Vector';

/**
 * Type of options of {@link PolygonNode}.
 */
export type PolygonNodeOptions<Events extends CanvasNodeEvents> = (
    & ShapeNodeOptions<Events>
    & Partial<{
        /**
         * The vertices of the polygon.
         */
        vertices: Vector[];
        /**
         * @override ShapeNodeOptions.closePath
         * @default true
         */
        closePath: boolean;
    }>
);
/** dts2md break */
/**
 * Class of polygon nodes.
 * (You can set `closePath` to `false` to create polylines.)
 */
export class PolygonNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends ShapeNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link PolygonNode}.
     */
    constructor(options?: PolygonNodeOptions<Events>) {
        super(options);
        this.closePath = options?.closePath ?? true;
        if (options?.vertices) {
            this.updateVertices(options.vertices);
        } else {
            this._vertices = [];
        }
    }
    /** dts2md break */
    /**
     * @override CanvasNode.tag
     */
    readonly tag: string = 'polygon';
    /** dts2md break */
    /**
     * The origin offset of the polygon.
     * (Updated internally when vertices change.)
     */
    readonly originOffset = new Vector();

    private _vertices!: Vector[];
    /** dts2md break */
    /**
     * @override ShapeNode.closePath
     * @default true
     */
    closePath: boolean;
    /** dts2md break */
    /**
     * Get the vertices of the polygon.
     * (Set them using `updateVertices`.)
     */
    get vertices(): readonly Vector[] {
        return this._vertices;
    }
    /** dts2md break */
    /**
     * Update the vertices of the polygon.
     */
    updateVertices(vertices: Vector[]) {

        if (!vertices.length) {
            throw new Error('no vertices given');
        }

        let xMin = Infinity;
        let xMax = -Infinity;
        let yMin = Infinity;
        let yMax = -Infinity;

        vertices.forEach(vertex => {
            if (vertex.x < xMin) {
                xMin = vertex.x;
            }
            if (vertex.x > xMax) {
                xMax = vertex.x;
            }
            if (vertex.y < yMin) {
                yMin = vertex.y;
            }
            if (vertex.y > yMax) {
                yMax = vertex.y;
            }
        });

        this.originOffset.set(xMin, yMin);
        this.bounds.width = xMax - xMin;
        this.bounds.height = yMax - yMin;
        this._vertices = vertices;

    }
    /** dts2md break */
    /**
     * @override ShapeNode.path
     */
    path(context: CanvasRenderingContext2D) {
        const { originOffset } = this;
        this.vertices.forEach((vertex, i) => {
            if (i) {
                context.lineTo(
                    vertex.x - originOffset.x,
                    vertex.y - originOffset.y,
                );
            } else {
                context.moveTo(
                    vertex.x - originOffset.x,
                    vertex.y - originOffset.y,
                );
            }
        });
    }
    /**
     * @override ShapeNode.containsPoint
     */
    containsPoint(x: number, y: number) {
        const { sign } = Math;
        const { _vertices, originOffset, position } = this;
        const { length: verticesLength } = _vertices;
        const _x = x - position.x + originOffset.x;
        const _y = y - position.y + originOffset.y;
        let j, v1, v2, cross1, x1, y1, x2, y2, cross2;
        for (let i = 0; i < verticesLength; i++) {
            j = (i + 1) % verticesLength;
            v1 = _vertices[i];
            v2 = _vertices[j];
            cross1 = v1.cross(v2);
            x1 = v1.x - _x;
            y1 = v1.y - _y;
            x2 = v2.x - _x;
            y2 = v2.y - _y;
            cross2 = x1 * y2 - y1 * x2;
            if (sign(cross1) === -sign(cross2)) {
                return false;
            }
        }
        return true;
    }

}
