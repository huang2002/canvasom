// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./Label.js" />

/**
 * @param {COM.Node[]} childNodes
 */
const Wrapper = childNodes => (
    COM.create('group', {
        penetrable: true,
    }, [
        COM.create(COM.ScrollView, {
            x: PADDING,
            y: PADDING,
            width: WIDTH - PADDING * 2,
            height: HEIGHT - PADDING * 2,
            vertical: true
        }, [
            COM.create('rect', {
                interactive: true,
                width: WIDTH - PADDING * 2,
                height: 800,
                radius: 10,
                style: {
                    fillStyle: '#EFE',
                    strokeStyle: '#06C',
                    shadowColor: '#999',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            }, childNodes),
            Label()
        ]),
    ])
);
