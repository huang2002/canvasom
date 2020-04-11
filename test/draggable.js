// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./root.js" />

const draggableTarget = COM.create('rect', {
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
         * @param {COM.PointerEvent} event
         */
        pointerdown(event) {
            event.preventDefault(); // prevent scrolling
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

const draggable = new COM.Draggable({
    target: draggableTarget,
    root,
});

const scrollView = root.selectClass('wrapper')[0].selectTag('scroll')[0];
scrollView.addListener(
    'scroll',
    /**
     * @param {COM.ScrollEvent} event
     */
    event => {
        if (draggable.isDragging) {
            const { data: { deltaX, deltaY } } = event;
            draggable.offsetX -= deltaX;
            draggable.offsetY -= deltaY;
            draggableTarget.update({
                x: draggableTarget.x + deltaX,
                y: draggableTarget.y + deltaY
            });
        }
    }
);
scrollView.insertBefore(draggableTarget, scrollView.childNodes[1]);
