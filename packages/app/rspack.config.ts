import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'

const is_prod = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
	entry: {
		main: './runtime/index.tsx'
	},
	output: {
		clean: is_prod
	},
	devtool: is_prod ? false : 'source-map',
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		tsConfigPath: resolve(__dirname, 'tsconfig.json')
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
		progress: false
	},
	experiments: {
		incrementalRebuild: true,
		outputModule: true,
		rspackFuture: {
			// newResolver: true,
			newTreeshaking: true,
			disableTransformByDefault: true
		}
	},
	plugins: [!is_prod && new ReactRefreshPlugin()].filter(Boolean),
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'builtin:swc-loader',
					options: {
                                    sourceMaps: !is_prod,
						jsc: {
							parser: {
								syntax: 'typescript',
								tsx: true,
								dynamicImport: true,
								exportDefaultFrom: true,
								exportNamespaceFrom: true,
								decorators: true
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true,
								react: {
									development: !is_prod,
									refresh: !is_prod,
									runtime: 'automatic',
									useBuiltins: true
								}
							}
						}
					}
				}
			},
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
			},
			{
				test: /\.svg$/,
				type: 'asset/source'
			}
		]
	}
})
