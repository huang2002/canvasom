// @ts-check
/// <reference types=".." />

const overlapTest = (
    COM.create('rect', {
        classNames: ['overlap-test'],
        x: 50,
        y: 680,
        width: 300,
        height: 60,
        radius: 5,
        style: {
            fillStyle: '#0F0',
            strokeStyle: '#999',
            lineWidth: 2,
        },
    }, [
        COM.create('text', {
            data: 'Drag it here.',
            width: 300,
            height: 60,
            style: {
                fillStyle: '#000',
                font: '30px sans-serif',
                textAlign: 'center',
                textBaseline: 'middle',
            },
        }),
    ])
);

/**
 * @param {COM.Node} target
 */
const testOverlap = target => {
    overlapTest.updateStyle({
        fillStyle: target.overlaps(overlapTest) ? '#F00' : '#0F0',
    });
};
