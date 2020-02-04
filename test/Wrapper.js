// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./Label.js" />

const Wrapper = (...childNodes) => (
    COM.create('group', {
        penetrable: true,
    }, [
        COM.create(
            'rect',
            {
                interactive: true,
                x: PADDING,
                y: PADDING,
                width: WIDTH - PADDING * 2,
                height: HEIGHT - PADDING * 2,
                radius: 10,
                style: {
                    fillStyle: '#EFE',
                    strokeStyle: '#06C',
                    shadowColor: '#999',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            },
            childNodes
        ),
        Label()
    ])
);
