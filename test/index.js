// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./graphic.js" />
/// <reference path="./layout.js" />
/// <reference path="./interaction.js" />
/// <reference path="./animation.js" />
const MENU_WIDTH = 200;
const MENU_HEIGHT = 50;

/**
 * @param {string} text
 * @param {COM.EventListener<COM.CanvasPointerEvent>} callback
 */
const MenuButton = (text, callback, visible = true) => (
    COM.create(COM.RectNode, {
        width: MENU_WIDTH,
        height: MENU_HEIGHT,
        radius: 10,
        interactive: true,
        visible,
        style: {
            fillStyle: '#FFF',
            strokeStyle: '#111',
            lineWidth: 2,
        },
        listeners: {
            click: callback,
        },
    }, [
        COM.create(COM.TextNode, {
            content: text,
            stretch: 'both',
            style: {
                fillStyle: '#000',
                textAlign: 'center',
                textBaseline: 'middle',
            },
        }),
    ])
);

const startView = COM.create(COM.AlignNode, {
    offsetY: 60,
    alignX: 'center',
    interactive: true,
    stretch: 'both',
}, [
    COM.create(COM.FlowNode, {
        boundsWidth: MENU_WIDTH,
        direction: 'y',
        gap: 20,
    }, [
        MenuButton('graphic test', () => {
            root.replaceChild(startView, graphicView);
            root.updateAndRender();
        }),
        MenuButton('layout test', () => {
            root.replaceChild(startView, layoutView);
            root.updateAndRender();
        }),
        MenuButton('interaction test', () => {
            root.replaceChild(startView, interactionView);
            root.updateAndRender();
        }),
        MenuButton('animation test', () => {
            root.replaceChild(startView, animationView);
            root.updateAndRender();
        }),
        MenuButton('invisible button', () => {
            alert('How could you see me?');
        }, false),
        MenuButton('toggle background', () => {
            if (root.computedStyle.fillStyle === null) {
                root.style.fillStyle = 'rgba(255, 255, 0, .5)';
                root.forceClear = true;
            } else {
                root.style.fillStyle = null;
                root.forceClear = false;
            }
            root.updateAndRender();
        }),
    ]),
]);

root.appendChild(startView);
root.updateAndRender();
