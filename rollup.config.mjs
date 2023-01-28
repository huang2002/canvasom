import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";

const input = './js/index.js';

export default [
    {
        input,
        plugins: [
            nodeResolve(),
            babel({
                babelHelpers: 'bundled',
                presets: [
                    ['@babel/preset-env', {
                        loose: true,
                    }],
                ],
            }),
        ],
        output: {
            format: 'umd',
            name: 'COM',
            file: './dist/canvasom.umd.js',
        },
    },
    {
        input,
        plugins: [
            nodeResolve(),
        ],
        output: {
            format: 'esm',
            file: './dist/canvasom.js',
        },
    },
];
