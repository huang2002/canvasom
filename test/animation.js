// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const ANIMATION_CONTROL_WIDTH = 100;
const ANIMATION_CONTROL_HEIGHT = 50;
const ANIMATED_RECT_SIZE = 100;
const ANIMATION_WIDTH = 500;
const ANIMATION_DURATION = 5000;

/**
 * @param {string} text
 * @param {COM.EventListener<COM.CanvasPointerEvent>} callback
 */
const AnimationControl = (text, callback) => (
    COM.create(COM.RectNode, {
        width: ANIMATION_CONTROL_WIDTH,
        height: ANIMATION_CONTROL_HEIGHT,
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
            boundsWidth: ANIMATION_CONTROL_WIDTH,
            boundsHeight: ANIMATION_CONTROL_HEIGHT,
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

const animatedRect = new COM.RectNode({
    width: ANIMATED_RECT_SIZE,
    height: ANIMATED_RECT_SIZE,
    style: {
        fillStyle: '#00F',
    },
});

/**
 * @type {COM.Animation | null}
 */
let animation = null;

const animationView = COM.create(COM.CanvasNode, {
    penetrable: true,
}, [

    COM.create(COM.RectNode, { // container
        offsetX: 50,
        offsetY: 100,
        width: ANIMATION_WIDTH,
        height: ANIMATED_RECT_SIZE,
        style: {
            boundsStyle: 'rgba(0, 255, 0, .5)',
            boundsWidth: 6,
        },
    }, [
        animatedRect,
    ]),

    COM.create(COM.FlowNode, { // controls
        offsetX: 50,
        offsetY: 300,
        gap: 15,
    }, [
        AnimationControl('start', (event) => {
            if (animation) {
                animation.stop(event.timeStamp);
            }
            animation = animatedRect.animate({
                key: 'offsetX',
                to: ANIMATION_WIDTH - ANIMATED_RECT_SIZE,
                duration: ANIMATION_DURATION,
                timing: COM.Timing.easeInOut,
                root,
                callback: console.log,
            });
        }),
        AnimationControl('stop', (event) => {
            if (animation) {
                animation.stop(event.timeStamp);
            }
        }),
        AnimationControl('resume', (event) => {
            if (animation) {
                animation.resume(event.timeStamp);
            }
        }),
        AnimationControl('finish', (event) => {
            if (animation) {
                animation.finish();
            }
        }),
        AnimationControl('reset', (event) => {
            if (animation) {
                animation.stop(event.timeStamp);
            }
            animatedRect.offsetX = 0;
            root.updateAndRender();
        }),
    ]),

    BackButton(),

]);
