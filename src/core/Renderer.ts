/**
 * Type of options of {@link Renderer}.
 */
export type RendererOptions = Partial<{
    /**
     * The canvas element to use.
     * (If this is omitted, one will be created internally.)
     */
    canvas?: HTMLCanvasElement;
    /**
     * Width of the view.
     * @default 480
     */
    width?: number;
    /**
     * Height of the view.
     * @default 320
     */
    height?: number;
    /**
     * Pixel ratio.
     * @default window.devicePixelRatio
     */
    ratio?: number;
}>;
/** dts2md break */
/**
 * Class of canvas 2D renderers.
 */
export class Renderer {
    /** dts2md break */
    /**
     * Constructor of renderers.
     */
    constructor(options?: RendererOptions) {

        const canvas = options?.canvas ?? document.createElement('canvas');
        this.canvas = canvas;

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('failed to create a canvas context');
        }
        this.context = context;

        this._width = options?.width ?? 480;
        this._height = options?.height ?? 320;
        this._ratio = options?.ratio ?? window.devicePixelRatio ?? 1;

        this.initialize();

    }
    /** dts2md break */
    /**
     * The canvas element in use.
     */
    readonly canvas: HTMLCanvasElement;
    /** dts2md break */
    /**
     * The 2D rendering context in use.
     */
    readonly context: CanvasRenderingContext2D;

    private _ratio: number;
    private _width: number;
    private _height: number;
    private _clientX!: number;
    private _clientY!: number;
    /** dts2md break */
    /**
     * Current pixel ratio.
     */
    get ratio() {
        return this._ratio;
    }
    /** dts2md break */
    /**
     * Current width of the view.
     */
    get width() {
        return this._width;
    }
    /** dts2md break */
    /**
     * Current height of the view.
     */
    get height() {
        return this._height;
    }
    /** dts2md break */
    /**
     * Get the client x of the canvas.
     * (Updated by `this.initialize`.)
     */
    get clientX() {
        return this._clientX;
    }
    /** dts2md break */
    /**
     * Get the client y of the canvas.
     * (Updated by `this.initialize`.)
     */
    get clientY() {
        return this._clientY;
    }
    /** dts2md break */
    /**
     * Resize the view.
     */
    resize(width: number, height: number, ratio?: number) {

        this._width = width;
        this._height = height;
        if (ratio) {
            this._ratio = ratio;
        }

        this.initialize();

    }
    /** dts2md break */
    /**
     * Initialize the renderer.
     */
    initialize() {

        const { canvas, _width, _height, _ratio } = this;
        const { style: canvasStyle } = canvas;
        canvas.width = _width * _ratio;
        canvas.height = _height * _ratio;
        canvasStyle.width = `${_width}px`;
        canvasStyle.height = `${_height}px`;
        this.context.setTransform(_ratio, 0, 0, _ratio, 0, 0,);

        const bounds = canvas.getBoundingClientRect();
        this._clientX = bounds.left;
        this._clientY = bounds.top;

    }
    /** dts2md break */
    /**
     * Get the corresponding x-offset in the canvas view
     * from the given x-offset in client view.
     */
    toViewX(clientX: number) {
        return clientX - this._clientX;
    }
    /** dts2md break */
    /**
     * Get the corresponding y-offset in the canvas view
     * from the given y-offset in client view.
     */
    toViewY(clientY: number) {
        return clientY - this._clientY;
    }

}
