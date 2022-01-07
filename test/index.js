// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./graphic.js" />
/// <reference path="./layout.js" />
/// <reference path="./interaction.js" />
const MENU_WIDTH = 200;
const MENU_HEIGHT = 50;

/**
 * @param {string} text
 * @param {COM.EventListener<COM.CanvasPointerEvent>} callback
 */
const MenuButton = (text, callback) => (
    COM.create(COM.RectNode, {
        width: MENU_WIDTH,
        height: MENU_HEIGHT,
        radius: 10,
        interactive: true,
        style: {
            fillStyle: '#FFF',
            strokeStyle: '#111',
            lineWidth: 2,
        },
        listeners: {
            click: callback,
        },
    }, [
        COM.create(COM.AlignNode, {
            alignX: 'center',
            alignY: 'center',
            boundsWidth: MENU_WIDTH,
            boundsHeight: MENU_HEIGHT,
        }, [
            COM.create(COM.TextNode, {
                content: text,
                style: {
                    fillStyle: '#000',
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
            }),
        ]),
    ])
);

const startView = COM.create(COM.AlignNode, {
    offsetY: 60,
    boundsWidth: root.width,
    alignX: 'center',
    interactive: true,
}, [
    COM.create(COM.FlowNode, {
        boundsWidth: MENU_WIDTH,
        direction: 'y',
        gap: 20,
    }, [
        MenuButton('graphic test', () => {
            root.replaceChild(startView, graphicView);
            COM.Schedule.updateAndRender(root);
        }),
        MenuButton('layout test', () => {
            root.replaceChild(startView, layoutView);
            COM.Schedule.updateAndRender(root);
        }),
        MenuButton('interaction test', () => {
            root.replaceChild(startView, interactionView);
            COM.Schedule.updateAndRender(root);
        }),
        MenuButton('toggle background', () => {
            if (root.computedStyle.fillStyle === null) {
                root.style.fillStyle = 'rgba(255, 255, 0, .5)';
                root.forceClear = true;
            } else {
                root.style.fillStyle = null;
                root.forceClear = false;
            }
            COM.Schedule.updateAndRender(root);
        }),
    ]),
]);

root.appendChild(startView);
COM.Schedule.updateAndRender(root);
