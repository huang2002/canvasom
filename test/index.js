// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./shape.js" />
/// <reference path="./layout.js" />
/// <reference path="./interaction.js" />
const MENU_WIDTH = 150;
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
    offsetY: 50,
    boundsWidth: root.width,
    alignX: 'center',
    interactive: true,
}, [
    COM.create(COM.FlowNode, {
        boundsWidth: MENU_WIDTH,
        direction: 'y',
        gap: 20,
    }, [
        MenuButton('shape test', () => {
            root.replaceChild(startView, shapeView);
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
    ]),
]);

root.appendChild(startView);
root.updateAndRender();
