// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const Label = () => (
    COM.create('rect', {
        classNames: ['label'],
        x: 30,
        y: -30,
        width: 140,
        height: 60,
        radius: -10,
        style: {
            fillStyle: '#FF0',
            strokeStyle: '#F00',
            lineWidth: 2,
            shadowColor: '#CCC',
            shadowBlur: 5,
            shadowOffsetY: 5
        }
    }, [
        COM.create('text', {
            data: 'TEST',
            x: 70,
            y: 32,
            style: {
                fillStyle: '#FC0',
                strokeStyle: '#F00',
                font: 'bold 32px sans-serif',
                textAlign: 'center',
                textBaseline: 'middle',
                lineWidth: 1,
                shadowColor: '#FFF',
                shadowOffsetY: 5
            }
        })
    ])
);
