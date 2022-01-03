// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
const shapeView = COM.create(COM.CanvasNode, {
    boundsWidth: root.width,
    boundsHeight: root.height,
    interactive: true,
}, [

    COM.create(COM.RectNode, {
        offsetX: 50,
        offsetY: 50,
        width: 100,
        height: 60,
        style: {
            fillStyle: '#F00',
        },
    }),

    COM.create(COM.RectNode, {
        offsetX: 170,
        offsetY: 50,
        width: 100,
        height: 60,
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
        height: 60,
        radius: -16,
        style: {
            fillStyle: '#0F0',
        },
    }),

    BackButton(),

]);
