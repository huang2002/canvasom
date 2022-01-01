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
