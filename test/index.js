// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
const startView = COM.create(COM.AlignNode, {
    offsetY: 50,
    width: root.width,
    height: root.height,
    alignX: 'center',
    interactive: true,
}, [
    COM.create(COM.FlowNode, {
        width: 300,
        height: 200,
        direction: 'y',
        gap: 20,
    }, [

        COM.create(COM.RectNode, { // outer rect 0
            width: 300,
            height: 200,
            radius: 16,
            clipContent: true,
            interactive: true,
            style: {
                fillStyle: '#FF0',
                strokeStyle: '#00F',
                lineWidth: 6,
            },
            listeners: {
                pointerstart(event) {
                    alert('Oops!');
                    console.log(event);
                },
            },
        }, [

            COM.create(COM.AlignNode, {
                width: 300,
                height: 200,
                alignX: 'end',
                alignY: 'end',
                interactive: true,
            }, [
                COM.create(COM.RectNode, { // inner rect
                    offsetY: 50,
                    width: 150,
                    height: 100,
                    interactive: true,
                    style: {
                        fillStyle: '#F00',
                        boundsStyle: '#0F0C',
                        boundsWidth: 15,
                        boundsJoin: 'round',
                    },
                    listeners: {
                        pointerstart(event) {
                            event.stop();
                            alert('hello!');
                            console.log(event);
                        },
                    },
                }),
            ]),

            COM.create(COM.AlignNode, {
                width: 300,
                height: 200,
                alignX: 'center',
                alignY: 'center',
            }, [
                COM.create(COM.TextNode, {
                    content: 'hello world',
                    style: {
                        fillStyle: '#000',
                        font: 'bold 25px Consolas',
                        textAlign: 'center',
                        textBaseline: 'middle',
                    },
                }),
            ]),

        ]),

        COM.create(COM.RectNode, { // outer rect 1
            width: 300,
            height: 200,
            radius: 16,
            clipContent: true,
            interactive: true,
            style: {
                fillStyle: '#0F0',
                strokeStyle: '#00F',
                lineWidth: 6,
            },
        }),

    ]),
]);

root.appendChild(startView);
root.updateAndRender();
