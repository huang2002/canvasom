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
    offsetY: 60,
    penetrable: true,
}, [

    COM.create(COM.AlignNode, { // view container
        boundsWidth: root.width,
        boundsHeight: root.height - 60,
        alignX: 'center',
    }, [
        COM.create(COM.ScrollNode, {
            boundsWidth: LAYOUT_CONTAINER_SIZE * 2 + LAYOUT_GAP,
            boundsHeight: LAYOUT_CONTAINER_SIZE * 2 + LAYOUT_GAP,
            scrollHeight: LAYOUT_CONTAINER_SIZE * 4,
            direction: 'y',
            root,
            style: {
                boundsStyle: 'rgba(255, 0, 0, .5)',
                boundsWidth: 6,
            },
            listeners: {
                scroll(event) {
                    if (event.data.deltaY !== 0) {
                        COM.Schedule.updateAndRender(root);
                    }
                },
            },
        }, [
            COM.create(COM.RectNode, {
                width: LAYOUT_CONTAINER_SIZE * 2 + LAYOUT_GAP,
                height: LAYOUT_CONTAINER_SIZE * 4,
                interactive: true,
                style: {
                    fillStyle: '#EEF8FF',
                    boundsStyle: null,
                },
            }, [
                COM.create(COM.FlowNode, {
                    boundsWidth: LAYOUT_CONTAINER_SIZE * 2 + LAYOUT_GAP,
                    direction: 'y',
                    gap: LAYOUT_GAP,
                }, [

                    COM.create(COM.FlowNode, { // row0
                        boundsHeight: LAYOUT_CONTAINER_SIZE,
                        direction: 'x',
                        gap: LAYOUT_GAP,
                    }, [

                        COM.create(COM.FlowNode, { // row0-left
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
                        ]),

                        COM.create(COM.FlowNode, { // row0-right
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

                    COM.create(COM.FlowNode, { // row1
                        boundsHeight: LAYOUT_CONTAINER_SIZE,
                        direction: 'x',
                        gap: LAYOUT_GAP,
                    }, [

                        COM.create(COM.RectNode, { // row1-left
                            width: LAYOUT_CONTAINER_SIZE,
                            height: LAYOUT_CONTAINER_SIZE,
                            clipContent: true,
                            interactive: true,
                            style: {
                                strokeStyle: 'rgba(0, 255, 0, .5)',
                                lineWidth: 6,
                            },
                        }, [
                            COM.create(COM.ScrollNode, {
                                boundsWidth: LAYOUT_CONTAINER_SIZE,
                                boundsHeight: LAYOUT_CONTAINER_SIZE,
                                scrollWidth: LAYOUT_CONTAINER_SIZE * 2,
                                direction: 'x',
                                root,
                                listeners: {
                                    scroll(event) {
                                        if (event.data.deltaX !== 0) {
                                            COM.Schedule.updateAndRender(root);
                                        }
                                    },
                                },
                            }, [
                                COM.create(COM.ArcNode, {
                                    radius: LAYOUT_CONTAINER_SIZE,
                                    style: {
                                        fillStyle: '#00F',
                                    },
                                }),
                            ]),
                        ]),

                        COM.create(COM.RectNode, { // row1-right
                            width: LAYOUT_CONTAINER_SIZE,
                            height: LAYOUT_CONTAINER_SIZE,
                            clipContent: true,
                            interactive: true,
                            style: {
                                strokeStyle: 'rgba(0, 255, 0, .5)',
                                lineWidth: 6,
                            },
                        }, [
                            COM.create(COM.ScrollNode, {
                                boundsWidth: LAYOUT_CONTAINER_SIZE,
                                boundsHeight: LAYOUT_CONTAINER_SIZE,
                                scrollHeight: LAYOUT_CONTAINER_SIZE * 2,
                                direction: 'y',
                                root,
                                listeners: {
                                    scroll(event) {
                                        if (event.data.deltaY !== 0) {
                                            COM.Schedule.updateAndRender(root);
                                        }
                                    },
                                },
                            }, [
                                COM.create(COM.ArcNode, {
                                    radius: LAYOUT_CONTAINER_SIZE,
                                    style: {
                                        fillStyle: '#00F',
                                    },
                                }),
                            ]),
                        ]),

                    ]),

                    COM.create(COM.AlignNode, { // row2
                        boundsWidth: LAYOUT_CONTAINER_SIZE * 2 + LAYOUT_GAP,
                        boundsHeight: LAYOUT_CONTAINER_SIZE,
                        alignX: 'center',
                        alignY: 'center',
                    }, [
                        COM.create(COM.RectNode, {
                            width: LAYOUT_CONTAINER_SIZE,
                            height: LAYOUT_CONTAINER_SIZE,
                            clipContent: true,
                            interactive: true,
                            style: {
                                strokeStyle: 'rgba(0, 255, 0, .5)',
                                lineWidth: 6,
                            },
                        }, [
                            COM.create(COM.ScrollNode, {
                                boundsWidth: LAYOUT_CONTAINER_SIZE,
                                boundsHeight: LAYOUT_CONTAINER_SIZE,
                                scrollWidth: LAYOUT_CONTAINER_SIZE * 2,
                                scrollHeight: LAYOUT_CONTAINER_SIZE * 2,
                                direction: 'both',
                                mode: 'both',
                                root,
                                listeners: {
                                    scroll(event) {
                                        const { data: { deltaX, deltaY } } = event;
                                        if ((deltaX !== 0) || (deltaY !== 0)) {
                                            COM.Schedule.updateAndRender(root);
                                        }
                                    },
                                },
                            }, [
                                COM.create(COM.ArcNode, {
                                    offsetX: LAYOUT_CONTAINER_SIZE / 2,
                                    offsetY: LAYOUT_CONTAINER_SIZE / 2,
                                    radius: LAYOUT_CONTAINER_SIZE / 2,
                                    style: {
                                        fillStyle: '#00F',
                                    },
                                }),
                            ]),
                        ]),
                    ]),

                ]),
            ]),
        ]),
    ]),

    BackButton(),

]);
