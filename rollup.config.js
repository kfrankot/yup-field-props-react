import { babel } from '@rollup/plugin-babel'
import includePaths from 'rollup-plugin-includepaths'
import license from 'rollup-plugin-license'
import terser from '@rollup/plugin-terser'

const banner = `
@preserve
Kevin Frankot - <%= pkg.name %> v<%= pkg.version %>
`

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
    },
    external: ['react', 'yup', '@yup-field-props/base'],
    plugins: [
      license({
        banner,
      }),
      includePaths({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
      terser(),
    ],
  },
]
