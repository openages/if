import { defineConfig } from 'rollup'

import { nodeResolve } from '@rollup/plugin-node-resolve'

export const plugins = [nodeResolve()]

export default defineConfig({
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'commonjs'
      },
	external: ['electron','url']
})
