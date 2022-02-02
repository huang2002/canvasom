// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
const COUNTER_WIDTH = 200;
const COUNTER_HEIGHT = 50;

/**
 * @param {string} eventName
 */
const InteractionCounter = (eventName) => {

    let count = 0;

    const textNode = COM.create(COM.TextNode, {
        content: `${eventName}: ${count}`,
        stretch: 1,
        style: {
            fillStyle: '#000',
            textAlign: 'center',
            textBaseline: 'middle',
        },
    });

    return COM.create(COM.RectNode, {
        classNames: ['interaction-counter'],
        width: COUNTER_WIDTH,
        height: COUNTER_HEIGHT,
        radius: 6,
        interactive: true,
        style: {
            strokeStyle: '#111',
            lineWidth: 2,
        },
        listeners: {
            [eventName]() {
                count++;
                textNode.content = `${eventName}: ${count}`;
                root.updateAndRender();
            },
        },
    }, [
        textNode,
    ]);

};

const interactionView = COM.create(COM.AlignNode, {
    id: 'interaction-view',
    offsetY: 60,
    alignX: 'center',
    interactive: true,
    stretch: 1,
}, [

    COM.create(COM.FlowNode, {
        id: 'interaction-container',
        boundsWidth: COUNTER_WIDTH,
        direction: 'y',
        gap: 20,
    }, [
        InteractionCounter('pointerstart'),
        InteractionCounter('pointermove'),
        InteractionCounter('pointerend'),
        InteractionCounter('wheel'),
        InteractionCounter('click'),
    ]),

    BackButton(),

]);
