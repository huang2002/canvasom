// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
const shapeView = COM.create(COM.CanvasNode, {
    penetrable: true,
}, [

    COM.create(COM.CanvasNode, { // shapes
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

    COM.create(COM.RectNode, {
        offsetY: 390,
        offsetX: 50,
        width: 200,
        height: 50,
        radius: 8,
        interactive: true,
        style: {
            fillStyle: '#FFF',
            strokeStyle: '#111',
            lineWidth: 2,
        },
        listeners: {
            click() {
                root.style.fillStyle = (
                    root.computedStyle.fillStyle === null
                        ? '#FFC'
                        : null
                );
                root.updateAndRender();
            },
        },
    }, [
        COM.create(COM.AlignNode, {
            alignX: 'center',
            alignY: 'center',
            boundsWidth: 200,
            boundsHeight: 50,
        }, [
            COM.create(COM.TextNode, {
                content: 'toggle background',
                style: {
                    fillStyle: '#000',
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
            }),
        ]),
    ]),

    BackButton(),

]);
