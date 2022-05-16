import typescript from 'rollup-plugin-typescript2'
export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'lib/mini-vue.cjs.js',
    },
    {
      format: 'esm',
      file: 'lib/mini-vue.esm.js',
    },
  ],
  plugins: [
    typescript(),
  ],
}
