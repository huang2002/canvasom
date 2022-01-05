// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
const shapeView = COM.create(COM.CanvasNode, {
    penetrable: true,
}, [

    COM.create(COM.CanvasNode, { // shapes
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

    ]),

    BackButton(),

]);
