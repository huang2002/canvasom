// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

/**
 * @type {Partial<COM.CanvasStyle>}
 */
const GRAPHIC_BOUNDS_STYLE = {
    boundsStyle: 'rgba(0, 255, 255, .5)',
    boundsWidth: 6,
};

/**
 * @param {string} source
 */
const createImageSource = (source) => {
    const image = new Image();
    image.src = source;
    image.addEventListener('load', () => {
        root.render();
    });
    return image;
};

/**
 * @type {COM.CanvasNode<any>[]}
 */
const serializableNodes = [

    COM.create(COM.CanvasNode, {
        offsetX: 50,
        offsetY: 50,
        boundsWidth: 100,
        boundsHeight: 100,
    }, [
        COM.create(COM.RectNode, {
            stretchX: 1.1,
            stretchY: .8,
            smartSize: true,
            style: {
                ...GRAPHIC_BOUNDS_STYLE,
                fillStyle: '#F00',
            },
        }),
    ]),

    COM.create(COM.RectNode, {
        offsetX: 170,
        offsetY: 50,
        width: 100,
        height: 80,
        radius: 16,
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            strokeStyle: '#00F',
            lineWidth: 2,
        },
    }),

    COM.create(COM.RectNode, {
        offsetX: 290,
        offsetY: 50,
        width: 100,
        height: 80,
        radius: -16,
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            fillStyle: '#0F0',
        },
    }),

    COM.create(COM.CanvasNode, {
        offsetX: 50,
        offsetY: 170,
        boundsWidth: 100,
        boundsHeight: 100,
    }, [
        COM.create(COM.ArcNode, {
            stretchX: 1.1,
            stretchY: 1,
            smartSize: true,
            style: {
                ...GRAPHIC_BOUNDS_STYLE,
                fillStyle: '#F00',
            },
        }),
    ]),

    COM.create(COM.ArcNode, {
        offsetX: 170,
        offsetY: 170,
        radius: 50,
        startAngle: 0,
        endAngle: COM.Utils.Constants.HALF_PI,
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            strokeStyle: '#00F',
            lineWidth: 2,
            lineCap: 'round',
        },
    }),

    COM.create(COM.ArcNode, {
        offsetX: 290,
        offsetY: 170,
        radius: 50,
        startAngle: 0,
        endAngle: COM.Utils.Constants.HALF_PI,
        clockwise: true,
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            fillStyle: '#0F0',
        },
    }),

    COM.create(COM.CanvasNode, {
        offsetX: 50,
        offsetY: 290,
        boundsWidth: 100,
        boundsHeight: 100,
    }, [
        COM.create(COM.SectorNode, {
            stretchX: 1.1,
            stretchY: 1,
            smartSize: true,
            startAngle: 0,
            endAngle: COM.Utils.Constants.TWO_PI,
            style: {
                ...GRAPHIC_BOUNDS_STYLE,
                fillStyle: '#F00',
            },
        }),
    ]),

    COM.create(COM.SectorNode, {
        offsetX: 170,
        offsetY: 290,
        radius: 50,
        startAngle: 0,
        endAngle: COM.Utils.Constants.HALF_PI,
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            strokeStyle: '#00F',
            lineWidth: 2,
            lineCap: 'round',
        },
    }),

    COM.create(COM.SectorNode, {
        offsetX: 290,
        offsetY: 290,
        radius: 50,
        startAngle: 0,
        endAngle: COM.Utils.Constants.HALF_PI,
        clockwise: true,
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            fillStyle: '#0F0',
        },
    }),

    COM.create(COM.PolygonNode, {
        offsetX: 410,
        offsetY: 50,
        vertices: COM.Vertices.createRectangle(100, 100),
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            fillStyle: '#FDD',
            strokeStyle: '#C33',
            lineWidth: 2,
        },
    }),

    COM.create(COM.PolygonNode, {
        offsetX: 410,
        offsetY: 170,
        vertices: COM.Vertices.createRegularPolygon(8, 50)
            .slice(0, -1)
            .concat(new COM.Vector(0, 0)),
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            fillStyle: '#FDD',
            strokeStyle: '#C33',
            lineWidth: 2,
        },
    }),

    COM.create(COM.PolygonNode, {
        offsetX: 410,
        offsetY: 290,
        vertices: COM.Vertices.createStar(5, 20, 50),
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            fillStyle: '#FDD',
            strokeStyle: '#C33',
            lineWidth: 2,
        },
    }),

    COM.create(COM.PolygonNode, {
        offsetX: 410,
        offsetY: 410,
        closePath: false,
        vertices: COM.Vertices.fromNumbers([
            0, 100,
            100, 0,
        ]),
        style: {
            ...GRAPHIC_BOUNDS_STYLE,
            strokeStyle: '#C33',
            lineWidth: 6,
            lineCap: 'round',
            lineJoin: 'round',
        },
    }),

    COM.create(COM.TextNode, {
        offsetX: 530,
        offsetY: 50,
        content: 'TEXT',
        style: {
            fillStyle: '#0F0',
            strokeStyle: '#00F',
            font: 'bold 50px sans-serif',
            shadowColor: '#F00',
            shadowBlur: 5,
            shadowOffsetY: 5,
        },
    }),

];

const serializedNodes = JSON.stringify(
    serializableNodes.map(
        node => node.toRecord()
    )
);

const deserializedNodes = JSON.parse(serializedNodes)
    .map(COM.createFromRecord);

const graphicView = COM.create(COM.CanvasNode, {
    id: 'graphic-view',
    penetrable: true,
    offsetY: 10,
    stretch: 1,
}, [

    ...deserializedNodes,

    COM.create(COM.ImageNode, {
        image: createImageSource('./face.png'),
        offsetX: 50,
        offsetY: 410,
        style: GRAPHIC_BOUNDS_STYLE,
    }),

    COM.create(COM.CanvasNode, {
        offsetX: 290,
        offsetY: 410,
        boundsWidth: 100,
        boundsHeight: 100,
    }, [
        COM.create(COM.ImageNode, {
            image: createImageSource('./face.png'),
            sourceX: 100,
            sourceY: 0,
            sourceWidth: 100,
            sourceHeight: 100,
            stretch: 1,
            smartSize: true,
            style: GRAPHIC_BOUNDS_STYLE,
        }),
    ]),

    BackButton(),

]);

assert(graphicView.selectTag('image').length === 2);
