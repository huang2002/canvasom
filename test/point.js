// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./root.js" />

const point = COM.create(COM.Arc, {
    penetrable: true,
    radius: 15,
    style: {
        fillStyle: '#FFF',
        opacity: .8
    }
});

let hidePointHandler;

root.addListener(
    'pointerdown',
    /** @param {COM.PointerEvent} event */
    event => {
        console.log(event);
        point.x = event.data.x - point.radius;
        point.y = event.data.y - point.radius;
        root.appendChild(point);
        clearTimeout(hidePointHandler);
        hidePointHandler = setTimeout(() => {
            root.removeChild(point);
        }, 666);
    }
);
