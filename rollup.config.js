import rollupPluginBabel from "rollup-plugin-babel";

const input = 'raw/index.js';

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
