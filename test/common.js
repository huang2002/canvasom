// @ts-check
/// <reference types=".." />
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

const createBackButton = () => (
    COM.create(COM.AlignNode, {
        alignX: 'center',
        alignY: 'end',
    }, [
        COM.create(COM.RectNode, {
            width: 100,
            height: 50,
            radius: 8,
            style: {
                strokeStyle: '#111',
            },
            listeners: {

            },
        }),
    ])
);
