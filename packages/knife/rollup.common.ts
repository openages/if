import { defineConfig } from 'rollup'

import { nodeResolve } from '@rollup/plugin-node-resolve'

export const plugins = [nodeResolve()]

const getConfig = (name: string) => {
	return defineConfig({
		output: {
			dir: `dist/${name}`,
			format: 'esm'
		}
	})
}

export const node_lib = defineConfig({
	input: 'src/node/index.ts',
	output: getConfig('node').output
})

export const react_lib = defineConfig({
	input: 'src/react/index.ts',
	output: getConfig('react').output,
	external: ['react']
})

export const storage_lib = defineConfig({
	input: 'src/storage/index.ts',
	output: getConfig('storage').output
})

export const types_lib = defineConfig({
	input: 'src/types/index.ts',
	output: getConfig('types').output
})
