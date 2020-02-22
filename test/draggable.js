// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./root.js" />

let isDragging = false,
    dragOffsetX = 0,
    dragOffsetY = 0;

const draggable = COM.create('rect', {
    id: 'draggable',
    interactive: true,
    x: 535,
    y: 380,
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
        }
    }
}, [
    COM.create('text', {
        data: 'draggable',
        width: 110,
        height: 50,
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
).addListener('pointerup', () => {
    isDragging = false;
});

const scrollView = root.selectClass('wrapper')[0].selectTag('scroll')[0];
scrollView.addListener(
    'scroll',
    /**
     * @param {COM.ScrollEvent} event
     */
    event => {
        if (isDragging) {
            const { data: { deltaX, deltaY } } = event;
            dragOffsetX -= deltaX;
            dragOffsetY -= deltaY;
            draggable.update({
                x: draggable.x + deltaX,
                y: draggable.y + deltaY
            });
        }
    }
);
scrollView.appendChild(draggable);
