// @ts-check
/// <reference types=".." />
/// <reference path="./common.js" />

const Shapes = () => COM.create('group', null,
    // fill with stroke (splitted)
    COM.create('arc', {
        x: 50,
        y: 70,
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
        x: 60,
        y: 60,
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
    }),
    // stroke without fill
    COM.create('arc', {
        x: 205,
        y: 70,
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
        x: 210,
        y: 60,
        radius: 50,
        startAngle: COM.Utils.deg2rad(260),
        endAngle: COM.Utils.Const.TWO_PI,
        style: {
            strokeStyle: Colors.DARK_BLUE,
            ...commonShadowStyle
        }
    }),
    // fill without stroke
    COM.create('sector', {
        x: 350,
        y: 70,
        radius: 50,
        startAngle: 0,
        endAngle: 5,
        style: {
            fillStyle: Colors.BLUE,
            ...commonShadowStyle
        }
    }),
    COM.create('sector', {
        x: 360,
        y: 60,
        radius: 50,
        startAngle: 0,
        endAngle: 5,
        anticlockwise: true,
        style: {
            fillStyle: Colors.LIGHT_BLUE,
            ...commonShadowStyle
        }
    }),
    // fill with stroke
    COM.create('sector', {
        x: 500,
        y: 70,
        radius: 50,
        startAngle: 0,
        endAngle: 5,
        style: {
            strokeStyle: Colors.DARK_BLUE,
            ...commonShadowStyle
        }
    }),
    COM.create('sector', {
        x: 510,
        y: 60,
        radius: 50,
        startAngle: 0,
        endAngle: 5,
        anticlockwise: true,
        style: {
            strokeStyle: Colors.DARK_BLUE,
            lineWidth: 2,
            ...commonShadowStyle
        }
    }),
    // lt-rb dash solid 2px dark
    COM.create('line', {
        x: 50,
        y: 220,
        width: 100,
        height: 100,
        style: {
            strokeStyle: Colors.DARK_BLUE,
            lineWidth: 2,
            lineDash: [5, 10, 15, 25],
            ...commonShadowStyle
        }
    }),
    // cross solid 8px square-cap transparent
    COM.create('line', {
        x: 200,
        y: 220,
        width: 100,
        height: 100,
        style: {
            strokeStyle: Colors.BLUE,
            lineWidth: 8,
            lineCap: 'square',
            opacity: .5,
            ...commonShadowStyle
        }
    }),
    COM.create('line', {
        x: 200,
        y: 220,
        width: 100,
        height: 100,
        cross: true,
        style: {
            strokeStyle: Colors.BLUE,
            lineWidth: 8,
            lineCap: 'square',
            opacity: .5,
            ...commonShadowStyle
        }
    }),
    // lt-rb dash 6px light round-cap
    COM.create('line', {
        x: 350,
        y: 220,
        width: 100,
        height: 100,
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
        x: 500,
        y: 220,
        width: 100,
        height: 100,
        cross: true,
        style: {
            strokeStyle: Colors.DARK_BLUE,
            lineWidth: 10,
            lineDash: [0, 2, 6, 12, 14],
            ...commonShadowStyle
        }
    })
);
