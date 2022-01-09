// @ts-check
/// <reference types=".." />
/// <reference path="./index.js" />
const BACK_BUTTON_WIDTH = 100;
const BACK_BUTTON_HEIGHT = 50;

const canvas = /** @type {HTMLCanvasElement} */(
    document.getElementById('canvas')
);

const renderer = new COM.Renderer({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight,
});

/**
 * @type {COM.CanvasRoot}
 */
const root = COM.create(COM.CanvasRoot, {
    renderer,
    interactive: true,
});

const BackButton = () => (
    COM.create(COM.AlignNode, {
        position: 'absolute',
        alignX: 'center',
        alignY: 'end',
        interactive: true,
        autoStretch: true,
    }, [
        COM.create(COM.RectNode, {
            offsetY: -50,
            width: BACK_BUTTON_WIDTH,
            height: BACK_BUTTON_HEIGHT,
            radius: 8,
            interactive: true,
            style: {
                fillStyle: '#FFF',
                strokeStyle: '#111',
                lineWidth: 2,
            },
            listeners: {
                click() {
                    root.replaceChild(root.childNodes[0], startView);
                    root.updateAndRender();
                },
            },
        }, [
            COM.create(COM.AlignNode, {
                alignX: 'center',
                alignY: 'center',
                autoStretch: true,
            }, [
                COM.create(COM.TextNode, {
                    content: 'back',
                    style: {
                        fillStyle: '#000',
                        textAlign: 'center',
                        textBaseline: 'middle',
                    },
                }),
            ]),
        ]),
    ])
);
