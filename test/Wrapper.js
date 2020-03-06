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
            width: WIDTH - PADDING * 2,
            height: HEIGHT - PADDING * 2,
            offsetHeight: 800,
            vertical: true
        }, [
            COM.create(COM.Align, {
                positionX: 'center',
                positionY: 'middle',
                width: WIDTH - PADDING * 2
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
                }, childNodes)
            ]),
            COM.create(COM.Align, {
                positionY: 'middle',
                direction: 'y'
            }, [
                Label()
            ])
        ])
    ])
);
