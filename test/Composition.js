// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const Composition = () => (
    COM.create('grid', {
        classNames: ['composition'],
        x: 50,
        y: 480,
        rows: 3,
        columns: 3,
        width: 150,
        height: 150,
    }, [
        COM.create('rect', {
            width: 100,
            height: 100,
            style: {
                fillStyle: '#F00',
            }
        }),
        COM.create('rect', {
            x: 1,
            y: 1,
            width: 100,
            height: 100,
            style: {
                fillStyle: '#00F',
                compositeOperation: 'multiply',
            }
        })
    ])
);
