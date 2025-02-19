import babel from '@rollup/plugin-babel'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.js', // Your entry point
  external: ['password-validator'],
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    // 1. Resolve modules
    nodeResolve(),

    // 2. Transform your code (including JSX) with Babel
    babel({
      extensions: ['.js', '.jsx'], // Ensure Babel processes .jsx files too
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {modules: false}, // Preserve ES modules for tree-shaking
        ],
        '@babel/preset-react',
      ],
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread'],
    }),

    // 3. Convert CommonJS modules (should come after Babel)
    commonjs(),
  ],
}
