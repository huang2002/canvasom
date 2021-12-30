// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
root.appendChild(

    COM.create(COM.AlignNode, {
        offsetY: 50,
        width: root.width,
        height: root.height,
        alignX: 'center',
    }, [
        COM.create(COM.RectNode, { // outer rect
            width: 300,
            height: 200,
            radius: 16,
            clipContent: true,
            style: {
                fillStyle: '#FF0',
                strokeStyle: '#00F',
                lineWidth: 6,
            },
        }, [

            COM.create(COM.AlignNode, {
                width: 300,
                height: 200,
                alignX: 'end',
                alignY: 'end',
            }, [
                COM.create(COM.RectNode, { // inner rect
                    offsetY: 50,
                    width: 150,
                    height: 100,
                    style: {
                        fillStyle: '#F00',
                        boundsStyle: '#0F0C',
                        boundsWidth: 15,
                        boundsJoin: 'round',
                    },
                }),
            ]),

        ]),
    ])

);

root.updateAndRender();
