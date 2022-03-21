// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const ANIMATION_CONTROL_WIDTH = 100;
const ANIMATION_CONTROL_HEIGHT = 50;
const ANIMATION_CONTAINER_WIDTH = 500;
const ANIMATION_CONTAINER_HEIGHT = 100;
const ANIMATION_DURATION = 5000;

/**
 * @param {string} text
 * @param {COM.EventListener<COM.CanvasPointerEvent>} callback
 */
const AnimationControl = (text, callback) => (
    COM.create(COM.RectNode, {
        classNames: ['animation-control'],
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
        COM.create(COM.TextNode, {
            content: text,
            stretch: 1,
            style: {
                fillStyle: '#000',
                textAlign: 'center',
                textBaseline: 'middle',
            },
        }),
    ])
);

const animatedRect = new COM.RectNode({
    id: 'animated-rect',
    stretchX: 0.2,
    stretchY: 1,
    smartSize: true,
    style: {
        fillStyle: '#00F',
    },
});

/**
 * @type {COM.Animation | null}
 */
let animation = null;

const animationView = COM.create(COM.CanvasNode, {
    id: 'animation-view',
    penetrable: true,
    stretch: 1,
}, [

    COM.create(COM.RectNode, {
        id: 'animation-container',
        offsetX: 50,
        offsetY: 100,
        width: ANIMATION_CONTAINER_WIDTH,
        height: ANIMATION_CONTAINER_HEIGHT,
        style: {
            boundsStyle: 'rgba(0, 255, 0, .5)',
            boundsWidth: 6,
        },
    }, [
        animatedRect,
    ]),

    COM.create(COM.FlowNode, {
        id: 'animation-controls',
        offsetX: 50,
        offsetY: 300,
        gap: 15,
    }, [
        AnimationControl('start', (event) => {
            if (animation) {
                animation.stop(event.timeStamp);
            }
            animation = COM.animate({
                target: animatedRect,
                key: 'offsetX',
                to: ANIMATION_CONTAINER_WIDTH - animatedRect.width,
                duration: ANIMATION_DURATION,
                timing: COM.Timing.easeInOut,
            });
            animation.on('update', console.log);
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
                animation.finish(event.timeStamp);
            }
        }),
        AnimationControl('reset', (event) => {
            if (animation) {
                animation.stop(event.timeStamp);
                animation = null;
            }
            animatedRect.offsetX = 0;
            root.updateAndRender();
        }),
    ]),

    BackButton(),

]);

assert(animationView.selectId('animated-rect') === animatedRect);
