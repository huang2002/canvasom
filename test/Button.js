// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const Button = () => (
    COM.create('rect', {
        classNames: ['button'],
        interactive: true,
        x: 50,
        y: 380,
        width: 120,
        height: 50,
        radius: 10,
        style: {
            fillStyle: '#FFF',
            strokeStyle: '#222',
            ...commonShadowStyle
        },
        listeners: {
            click() {
                alert('Hello, canvasom!');
            }
        }
    }, [
        COM.create('text', {
            data: 'click me',
            x: 60,
            y: 25,
            style: {
                font: '22px sans-serif',
                textAlign: 'center',
                textBaseline: 'middle',
                fillStyle: '#000'
            }
        })
    ])
);
