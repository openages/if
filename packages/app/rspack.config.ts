import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'

const is_prod = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
	entry: {
		main: './runtime/index.tsx'
	},
	output: {
		clean: is_prod
	},
	devtool: false,
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		tsConfigPath: resolve(__dirname, 'tsconfig.json'),
		alias: {
			react: resolve(__dirname, 'node_modules/react')
		}
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			maxSize: 30000
		}
	},
	builtins: {
		html: [
			{
				template: './public/index.html',
				title: 'IF - GTD for prefessionals.'
			}
		],
		decorator: {},
		progress: false
	},
	experiments: {
		incrementalRebuild: true,
		outputModule: true
	},
	module: {
		rules: [
			{
				test: /\.global\.css$/,
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['postcss-nested']
							}
						}
					}
				],
				type: 'css'
			},
			{
				test: /\.css$/,
				exclude: /\.global\.css$/,
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['postcss-nested']
							}
						}
					}
				],
				type: 'css/module'
			}
		]
	}
})
