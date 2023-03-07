import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { minify, swc } from 'rollup-plugin-swc3'

import config, { plugins } from './rollup.common'

export default defineConfig({
	...config,
	plugins: [...plugins, swc(), minify(), del({ targets: 'dist/*' })]
})
