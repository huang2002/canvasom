// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />
/// <reference path="./Wrapper.js" />
/// <reference path="./Shapes.js" />
/// <reference path="./Button.js" />
/// <reference path="./StopPropagation.js" />
/// <reference path="./MyImage.js" />

const root = COM.create(COM.Root, {
    id: 'root',
    interactive: true,
    width: WIDTH,
    height: HEIGHT,
    style: {
        fillStyle: '#CCC',
        ratio: RATIO
    }
}, [
    Wrapper([
        Shapes(),
        Button(),
        StopPropagation(),
        MyImage()
    ]),
    // invisible text
    COM.create('text', {
        data: 'THIS SHOULD BE INVISIBLE',
        visible: false,
        x: 200,
        y: 200,
        style: {
            font: 'bold 30px Consolas',
            fillStyle: '#F00',
            strokeStyle: '#600'
        }
    })
]);

document.body.appendChild(root.canvas);
