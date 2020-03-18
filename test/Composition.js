// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const Composition = () => (
    COM.create('group', {
        classNames: ['composition'],
        x: 50,
        y: 480
    }, [
        COM.create('rect', {
            width: 100,
            height: 100,
            style: {
                fillStyle: '#F00',
            }
        }),
        COM.create('rect', {
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            style: {
                fillStyle: '#00F',
                compositeOperation: 'multiply',
            }
        })
    ])
);
