import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'

module.exports = defineConfig({
	entry: {
		main: './runtime/index.tsx'
	},
	output: {
		filename: 'main.js',
		path: resolve(`${process.cwd()}/dist`)
	},
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		tsConfigPath: resolve(__dirname, 'tsconfig.json')
	},
	builtins: {
		html: [
			{
				template: './public/index.html',
				title: 'IF - GTD for prefessionals.',
				favicon: './public/favicon.ico'
			}
		],
		decorator: {},
		progress: false
	},
	experiments: { incrementalRebuild: true, outputModule: true }
})
