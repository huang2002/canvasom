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

    BackButton(),

]);
