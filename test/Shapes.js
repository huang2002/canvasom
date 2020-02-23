// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const Shapes = () => (
    COM.create('flow', {
        direction: 'y',
        x: 50,
        y: 70
    }, [
        COM.create('flow', {
            y: 10
        }, [
            // fill with stroke (splitted)
            COM.create('center', {
                x: 50,
                y: 50,
                direction: 'both'
            }, [
                COM.create('arc', {
                    radius: 50,
                    startAngle: COM.Utils.deg2rad(260),
                    endAngle: COM.Utils.Const.TWO_PI,
                    closePath: false,
                    anticlockwise: true,
                    style: {
                        fillStyle: Colors.BLUE,
                        strokeStyle: Colors.DARK_BLUE,
                        lineWidth: 2,
                        ...commonShadowStyle
                    }
                }),
                COM.create('arc', {
                    x: 5,
                    y: -10,
                    radius: 50,
                    startAngle: COM.Utils.deg2rad(260),
                    endAngle: COM.Utils.Const.TWO_PI,
                    closePath: false,
                    style: {
                        fillStyle: Colors.LIGHT_BLUE,
                        strokeStyle: Colors.DARK_BLUE,
                        lineWidth: 2,
                        ...commonShadowStyle
                    }
                })
            ]),
            // stroke without fill
            COM.create('center', {
                x: 50,
                y: 50,
                direction: 'both'
            }, [
                COM.create('arc', {
                    radius: 50,
                    startAngle: COM.Utils.deg2rad(260),
                    endAngle: COM.Utils.Const.TWO_PI,
                    anticlockwise: true,
                    style: {
                        strokeStyle: Colors.DARK_BLUE,
                        lineWidth: 2,
                        ...commonShadowStyle
                    }
                }),
                COM.create('arc', {
                    x: 5,
                    y: -10,
                    radius: 50,
                    startAngle: COM.Utils.deg2rad(260),
                    endAngle: COM.Utils.Const.TWO_PI,
                    style: {
                        strokeStyle: Colors.DARK_BLUE,
                        ...commonShadowStyle
                    }
                })
            ]),
            // fill without stroke
            COM.create('center', {
                x: 50,
                y: 50,
                direction: 'both'
            }, [
                COM.create('sector', {
                    radius: 50,
                    startAngle: 0,
                    endAngle: 5,
                    style: {
                        fillStyle: Colors.BLUE,
                        ...commonShadowStyle
                    }
                }),
                COM.create('sector', {
                    x: 10,
                    y: -10,
                    radius: 50,
                    startAngle: 0,
                    endAngle: 5,
                    anticlockwise: true,
                    style: {
                        fillStyle: Colors.LIGHT_BLUE,
                        ...commonShadowStyle
                    }
                })
            ]),
            // fill with stroke
            COM.create('center', {
                x: 50,
                y: 50,
                direction: 'both'
            }, [
                COM.create('sector', {
                    radius: 50,
                    startAngle: 0,
                    endAngle: 5,
                    style: {
                        strokeStyle: Colors.DARK_BLUE,
                        ...commonShadowStyle
                    }
                }),
                COM.create('sector', {
                    x: 10,
                    y: -10,
                    radius: 50,
                    startAngle: 0,
                    endAngle: 5,
                    anticlockwise: true,
                    style: {
                        strokeStyle: Colors.DARK_BLUE,
                        lineWidth: 2,
                        ...commonShadowStyle
                    }
                })
            ])
        ]),
        COM.create('flow', {
            y: 30
        }, [
            // lt-rb dash solid 2px dark
            COM.create('line', {
                deltaX: 100,
                deltaY: 100,
                style: {
                    strokeStyle: Colors.DARK_BLUE,
                    lineWidth: 2,
                    lineDash: [5, 10, 15, 25],
                    ...commonShadowStyle
                }
            }),
            // cross solid 8px square-cap transparent
            COM.create('group', {
                x: 60,
                direction: 'both'
            }, [
                COM.create('line', {
                    deltaX: 100,
                    deltaY: 100,
                    style: {
                        strokeStyle: Colors.BLUE,
                        lineWidth: 8,
                        lineCap: 'square',
                        opacity: .5,
                        ...commonShadowStyle
                    }
                }),
                COM.create('line', {
                    deltaX: 100,
                    deltaY: 100,
                    cross: true,
                    style: {
                        strokeStyle: Colors.BLUE,
                        lineWidth: 8,
                        lineCap: 'square',
                        opacity: .5,
                        ...commonShadowStyle
                    }
                })
            ]),
            // lt-rb dash 6px light round-cap
            COM.create('line', {
                x: 60,
                deltaX: 100,
                deltaY: 100,
                style: {
                    strokeStyle: Colors.LIGHT_BLUE,
                    lineWidth: 6,
                    lineCap: 'round',
                    lineDash: [6, 12, 18, 30],
                    lineDashOffset: 3,
                    ...commonShadowStyle
                }
            }),
            // rt-lb dash 10px dark
            COM.create('line', {
                x: 60,
                deltaX: 100,
                deltaY: 100,
                cross: true,
                style: {
                    strokeStyle: Colors.DARK_BLUE,
                    lineWidth: 10,
                    lineDash: [0, 2, 6, 12, 14],
                    ...commonShadowStyle
                }
            })
        ])
    ])
);
