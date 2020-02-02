// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const StopPropagation = () => (
    COM.create('rect', {
        interactive: true,
        x: 200,
        y: 380,
        width: 240,
        height: 50,
        radius: 6,
        style: {
            fillStyle: '#999',
            strokeStyle: '#222'
        },
        listeners: {
            /**
             * @param {COM.PointerEvent} event
             */
            pointerdown(event) {
                event.stopPropagation();
            }
        }
    },
        COM.create('text', {
            data: 'event.stopPropagation()',
            x: 120,
            y: 25,
            style: {
                font: 'bold 18px sans-serif',
                textAlign: 'center',
                textBaseline: 'middle',
                fillStyle: '#000',
                shadowColor: '#FFF',
                shadowOffsetY: 1
            }
        })
    )
);
