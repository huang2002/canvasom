// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./Label.js" />

/**
 * @param {COM.Node[]} childNodes
 */
const Wrapper = childNodes => (
    COM.create('group', {
        classNames: ['wrapper'],
        penetrable: true,
    }, [
        COM.create(COM.Scroll, {
            x: PADDING,
            y: PADDING,
            width: INNER_WIDTH,
            height: HEIGHT - PADDING * 2,
            offsetHeight: 800,
            vertical: true
        }, [
            COM.create(COM.Align, {
                positionX: 'center',
                positionY: 'middle',
                width: INNER_WIDTH
            }, [
                COM.create('rect', {
                    interactive: true,
                    width: INNER_WIDTH,
                    height: 800,
                    radius: 10,
                    style: {
                        fillStyle: '#EFE',
                        strokeStyle: '#06C',
                        shadowColor: '#999',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                }, childNodes)
            ]),
            COM.create(COM.Align, {
                positionX: 'right',
                positionY: 'middle',
                width: INNER_WIDTH,
                direction: 'both',
                penetrable: true
            }, [
                Label()
            ])
        ])
    ])
);
