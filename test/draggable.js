// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./root.js" />

let isDragging = false,
    dragOffsetX = 0,
    dragOffsetY = 0;

const draggable = COM.create('rect', {
    interactive: true,
    x: PADDING + 535,
    y: PADDING + 380,
    width: 110,
    height: 50,
    radius: 6,
    style: {
        fillStyle: '#FFF',
        strokeStyle: '#444',
        ...commonShadowStyle
    },
    listeners: {
        /**
         * @param {COM.Rect} this
         * @param {COM.PointerEvent} event
         */
        pointerdown(event) {
            event.preventDefault();
            isDragging = true;
            dragOffsetX = event.data.x - this.x;
            dragOffsetY = event.data.y - this.y;
        },
        pointerup() {
            isDragging = false;
        }
    }
}, [
    COM.create('text', {
        data: 'draggable',
        x: 55,
        y: 25,
        style: {
            fillStyle: '#000',
            font: '18px Consolas',
            textAlign: 'center',
            textBaseline: 'middle'
        }
    })
]);

root.addListener(
    'pointermove',
    /**
     * @param {COM.PointerEvent} event
     */
    event => {
        if (isDragging) {
            draggable.update({
                x: event.data.x - dragOffsetX,
                y: event.data.y - dragOffsetY
            });
        }
    }
);

root.appendChild(draggable);
