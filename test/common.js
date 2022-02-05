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

const resizeRoot = () => {
    root.renderer.resize(window.innerWidth, window.innerHeight);
    root.updateAndRender();
};

window.addEventListener('resize', resizeRoot);
window.addEventListener('orientationchange', resizeRoot);

const BackButton = () => (
    COM.create(COM.AlignNode, {
        classNames: ['back-button'],
        offsetMode: 'absolute',
        alignX: 'center',
        alignY: 'end',
        interactive: true,
        stretch: 1,
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
            COM.create(COM.TextNode, {
                content: 'back',
                stretch: 1,
                style: {
                    fillStyle: '#000',
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
            }),
        ]),
    ])
);

/**
 * @param {boolean} condition
 */
const assert = (condition) => {
    if (!condition) {
        throw new Error('assertion failed');
    }
};
