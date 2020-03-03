// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const MyImage = () => {

    const srcWidth = 115,
        srcHeight = 50,
        offsetX = 30,
        offsetY = 20;

    /**
     * @type {COM.Root}
     */
    // @ts-ignore
    const _root = COM.parseArchive({
        tag: 'root',
        options: {
            width: 200,
            height: 100,
            style: {
                ratio: RATIO
            }
        },
        childNodes: [{
            tag: 'rect',
            options: {
                x: offsetX + 25,
                y: offsetY + 10,
                width: 80,
                height: 30,
                radius: 5,
                style: {
                    fillStyle: '#FF3',
                    strokeStyle: '#F00',
                    shadowColor: '#F00',
                    shadowOffsetX: 2,
                    shadowOffsetY: 3
                }
            },
            childNodes: [{
                tag: 'text',
                options: {
                    data: 'image',
                    width: 80,
                    height: 30,
                    style: {
                        font: 'bold 18px Consolas',
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fillStyle: '#00F',
                        shadowColor: '#FFF',
                        shadowOffsetY: '1'
                    }
                }
            }]
        }]
    });

    _root.compute();
    _root.compose();
    COM.Schedule.unmark(_root);

    return COM.create('rect', {
        classNames: ['my-image'],
        x: 390,
        y: 380,
        width: srcWidth,
        height: srcHeight,
        radius: 6,
        clipPath: true,
        style: {
            strokeStyle: '#090',
            ...commonShadowStyle
        }
    }, [
        COM.create('image', {
            texture: _root.canvas,
            interactive: true,
            width: srcWidth,
            height: srcHeight,
            srcX: offsetX * RATIO,
            srcY: offsetY * RATIO,
            srcWidth: srcWidth * RATIO,
            srcHeight: srcHeight * RATIO,
            style: {
                fillStyle: '#9FF'
            }
        }, [
            COM.create('text', {
                data: 'mark',
                x: 2,
                y: 2,
                style: {
                    font: 'bold 10px sans-serif',
                    fillStyle: '#00F',
                    opacity: .8
                }
            })
        ])
    ]);

};
