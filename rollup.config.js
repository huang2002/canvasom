import rollupPluginBabel from 'rollup-plugin-babel';

const input = 'js/index.js';

export default [
    {
        input,
        plugins: [
            rollupPluginBabel()
        ],
        output: {
            format: 'umd',
            name: 'COM',
            file: 'dist/canvasom.umd.js'
        }
    },
    {
        input,
        output: {
            format: 'esm',
            file: 'dist/canvasom.js'
        }
    }
];
