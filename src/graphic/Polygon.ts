import { ShapeNode, ShapeNodeOptions } from "./ShapeNode";
import { CanvasNodeEvents } from '../core/CanvasNode';
import type { VectorLike } from '../common/Vector';

/**
 * Type of options of {@link PolygonNode}.
 */
export type PolygonNodeOptions<Events extends CanvasNodeEvents> = (
    & ShapeNodeOptions<Events>
    & Partial<{
        /**
         * The vertices of the polygon.
         */
        vertices: VectorLike[];
    }>
);
/** dts2md break */
/**
 * Class of polygonangle nodes.
 */
export class PolygonNode<Events extends CanvasNodeEvents = CanvasNodeEvents>
    extends ShapeNode<Events> {
    /** dts2md break */
    /**
     * Constructor of {@link PolygonNode}.
     */
    constructor(options?: PolygonNodeOptions<Events>) {
        super(options);
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

    private _vertices!: VectorLike[];
    private _originX = 0;
    private _originY = 0;
    /** dts2md break */
    /**
     * @override ShapeNode.closePath
     * @default true
     */
    closePath = true;
    /** dts2md break */
    /**
     * Get the vertices of the polygon.
     * (Set them using `updateVertices`.)
     */
    get vertices(): readonly VectorLike[] {
        return this._vertices;
    }
    /** dts2md break */
    /**
     * Update the vertices of the polygon.
     */
    updateVertices(vertices: VectorLike[]) {

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
            } else if (vertex.x > xMax) {
                xMax = vertex.x;
            }
            if (vertex.y < yMin) {
                yMin = vertex.y;
            } else if (vertex.y > yMax) {
                yMax = vertex.y;
            }
        });

        this._originX = xMin;
        this._originY = yMin;
        this.bounds.width = xMax - xMin;
        this.bounds.height = yMax - yMin;
        this._vertices = vertices;

    }
    /** dts2md break */
    /**
     * @override ShapeNode.path
     */
    path(context: CanvasRenderingContext2D) {
        const { _originX, _originY } = this;
        this.vertices.forEach((vertex, i) => {
            if (i) {
                context.lineTo(
                    vertex.x - _originX,
                    vertex.y - _originY,
                );
            } else {
                context.moveTo(
                    vertex.x - _originX,
                    vertex.y - _originY,
                );
            }
        });
    }

}
