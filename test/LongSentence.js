// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const LongSentence = () => (
    COM.create('rect', {
        classNames: ['long-sentence'],
        x: 250,
        y: 480,
        width: 380,
        height: 100,
        radius: 10,
        clipPath: true,
        style: {
            fillStyle: '#FFF',
            strokeStyle: '#999',
        },
    }, [
        COM.create('scroll', {
            width: 380,
            height: 100,
            offsetWidth: 800,
            horizontal: true,
        }, [
            COM.create('text', {
                data: 'This is a long sentence.',
                x: 30,
                width: 830,
                height: 100,
                style: {
                    font: '50px Consolas',
                    fillStyle: '#00F',
                    textBaseline: 'middle',
                }
            }),
        ])
    ])
);
