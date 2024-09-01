// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts', // ES 모듈 파일
    output: {
      file: 'dist/index.mjs',
      format: 'es', // ES 모듈
    },
    plugins: [typescript()],
  },
  {
    input: 'src/index.ts', // CommonJS 모듈 파일
    output: {
      file: 'dist/index.cjs',
      format: 'cjs', // CommonJS
    },
    plugins: [typescript()],
  }
];