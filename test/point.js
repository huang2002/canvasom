// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./root.js" />

const point = COM.create(COM.Arc, {
    id: 'point',
    penetrable: true,
    radius: 15,
    style: {
        fillStyle: '#FFF',
        opacity: .8
    }
});

root.listeners = {

    /** @param {COM.PointerEvent} event */
    pointerdown(event) {
        point.x = event.data.x - point.radius;
        point.y = event.data.y - point.radius;
        root.appendChild(point);
    },

    /** @param {COM.PointerEvent} event */
    pointermove(event) {
        point.update({
            x: event.data.x - point.radius,
            y: event.data.y - point.radius
        });
    },

    pointerup() {
        root.removeChild(point);
    }

};
