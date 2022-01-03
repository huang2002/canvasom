// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
const LAYOUT_CONTAINER_SIZE = 200;
const LAYOUT_RECT_SIZE = 50;
const LAYOUT_GAP = 25;

const LayoutRect = () => (
    COM.create(COM.RectNode, {
        width: LAYOUT_RECT_SIZE,
        height: LAYOUT_RECT_SIZE,
        style: {
            fillStyle: '#00F',
        },
    })
);

const layoutView = COM.create(COM.CanvasNode, {
    penetrable: true,
}, [

    // outer container
    COM.create(COM.AlignNode, {
        offsetY: 50,
        boundsWidth: root.width,
        boundsHeight: root.height - 50,
        alignX: 'center',
    }, [
        COM.create(COM.FlowNode, {
            boundsWidth: LAYOUT_CONTAINER_SIZE,
            direction: 'y',
            gap: LAYOUT_GAP,
        }, [

            COM.create(COM.AlignNode, {
                boundsWidth: LAYOUT_CONTAINER_SIZE,
                boundsHeight: LAYOUT_RECT_SIZE,
                alignX: 'begin',
                style: {
                    boundsStyle: 'rgba(0, 255, 0, .5)',
                    boundsWidth: 6,
                },
            }, [
                LayoutRect(),
            ]),

            COM.create(COM.AlignNode, {
                boundsWidth: LAYOUT_CONTAINER_SIZE,
                boundsHeight: LAYOUT_RECT_SIZE,
                alignX: 'center',
                style: {
                    boundsStyle: 'rgba(0, 255, 0, .5)',
                    boundsWidth: 6,
                },
            }, [
                LayoutRect(),
            ]),

            COM.create(COM.AlignNode, {
                boundsWidth: LAYOUT_CONTAINER_SIZE,
                boundsHeight: LAYOUT_RECT_SIZE,
                alignX: 'end',
                style: {
                    boundsStyle: 'rgba(0, 255, 0, .5)',
                    boundsWidth: 6,
                },
            }, [
                LayoutRect(),
            ]),

            COM.create(COM.FlowNode, {
                boundsHeight: LAYOUT_CONTAINER_SIZE,
                gap: LAYOUT_GAP,
            }, [

                COM.create(COM.AlignNode, {
                    boundsWidth: LAYOUT_RECT_SIZE,
                    boundsHeight: LAYOUT_CONTAINER_SIZE,
                    alignY: 'begin',
                    style: {
                        boundsStyle: 'rgba(0, 255, 0, .5)',
                        boundsWidth: 6,
                    },
                }, [
                    LayoutRect(),
                ]),

                COM.create(COM.AlignNode, {
                    boundsWidth: LAYOUT_RECT_SIZE,
                    boundsHeight: LAYOUT_CONTAINER_SIZE,
                    alignY: 'center',
                    style: {
                        boundsStyle: 'rgba(0, 255, 0, .5)',
                        boundsWidth: 6,
                    },
                }, [
                    LayoutRect(),
                ]),

                COM.create(COM.AlignNode, {
                    boundsWidth: LAYOUT_RECT_SIZE,
                    boundsHeight: LAYOUT_CONTAINER_SIZE,
                    alignY: 'end',
                    style: {
                        boundsStyle: 'rgba(0, 255, 0, .5)',
                        boundsWidth: 6,
                    },
                }, [
                    LayoutRect(),
                ]),

            ]),

        ]),
    ]),

    BackButton(),

]);
