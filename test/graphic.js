// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

/**
 * @param {string} source
 */
const createImageSource = (source) => {
    const image = new Image();
    image.src = source;
    image.addEventListener('load', () => {
        requestAnimationFrame(root.updateAndRender);
    });
    return image;
};

const graphicView = COM.create(COM.CanvasNode, {
    penetrable: true,
}, [

    COM.create(COM.CanvasNode, { // container
        offsetY: 10,
        style: {
            boundsStyle: 'rgba(0, 255, 255, .5)',
            boundsWidth: 6,
        },
    }, [

        COM.create(COM.RectNode, {
            offsetX: 50,
            offsetY: 50,
            width: 100,
            height: 80,
            style: {
                fillStyle: '#F00',
            },
        }),

        COM.create(COM.RectNode, {
            offsetX: 170,
            offsetY: 50,
            width: 100,
            height: 80,
            radius: 16,
            style: {
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
                fillStyle: '#0F0',
            },
        }),

        COM.create(COM.ArcNode, {
            offsetX: 50,
            offsetY: 150,
            radius: 50,
            style: {
                fillStyle: '#F00',
            },
        }),

        COM.create(COM.ArcNode, {
            offsetX: 170,
            offsetY: 150,
            radius: 50,
            startAngle: 0,
            endAngle: COM.Utils.Constants.HALF_PI,
            style: {
                strokeStyle: '#00F',
                lineWidth: 2,
                lineCap: 'round',
            },
        }),

        COM.create(COM.ArcNode, {
            offsetX: 290,
            offsetY: 150,
            radius: 50,
            startAngle: 0,
            endAngle: COM.Utils.Constants.HALF_PI,
            clockwise: true,
            style: {
                fillStyle: '#0F0',
            },
        }),

        COM.create(COM.SectorNode, {
            offsetX: 50,
            offsetY: 270,
            radius: 50,
            startAngle: 0,
            endAngle: COM.Utils.Constants.TWO_PI,
            style: {
                fillStyle: '#F00',
            },
        }),

        COM.create(COM.SectorNode, {
            offsetX: 170,
            offsetY: 270,
            radius: 50,
            startAngle: 0,
            endAngle: COM.Utils.Constants.HALF_PI,
            style: {
                strokeStyle: '#00F',
                lineWidth: 2,
                lineCap: 'round',
            },
        }),

        COM.create(COM.SectorNode, {
            offsetX: 290,
            offsetY: 270,
            radius: 50,
            startAngle: 0,
            endAngle: COM.Utils.Constants.HALF_PI,
            clockwise: true,
            style: {
                fillStyle: '#0F0',
            },
        }),

        COM.create(COM.ImageNode, {
            image: createImageSource('./face.png'),
            offsetX: 50,
            offsetY: 390,
        }),

        COM.create(COM.ImageNode, {
            image: createImageSource('./face.png'),
            offsetX: 290,
            offsetY: 390,
            sourceX: 100,
            sourceY: 0,
            sourceWidth: 100,
            sourceHeight: 100,
            destinationWidth: 100,
            destinationHeight: 100,
        }),

    ]),

    BackButton(),

]);
