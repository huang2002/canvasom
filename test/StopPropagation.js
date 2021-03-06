// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const StopPropagation = () => (
    COM.create('rect', {
        classNames: ['stop-propagation'],
        interactive: true,
        x: 200,
        y: 380,
        width: 160,
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
            },
            /**
             * @param {COM.WheelEvent} event
             */
            wheel(event) {
                event.stopPropagation();
            }
        }
    }, [
        COM.create('text', {
            data: 'no propagation',
            width: 160,
            height: 50,
            style: {
                font: 'bold 18px sans-serif',
                textAlign: 'center',
                textBaseline: 'middle',
                fillStyle: '#000',
                shadowColor: '#FFF',
                shadowOffsetY: 1
            }
        })
    ])
);
