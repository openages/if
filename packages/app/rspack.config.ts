import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'
import { HtmlRspackPlugin } from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'

const is_prod = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
	entry: {
		main: './runtime/index.tsx'
	},
	output: {
		clean: is_prod
	},
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		tsConfigPath: resolve(__dirname, 'tsconfig.json')
	},
	devServer: {
		compress: false
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			maxSize: 30000
		}
	},
	experiments: {
		topLevelAwait: true,
		// outputModule: !is_prod,
		rspackFuture: {
			newResolver: true,
			// newTreeshaking: true,
			// disableApplyEntryLazily: true,
			disableTransformByDefault: true
		}
	},
	devtool: is_prod ? false : 'source-map',
	plugins: [
		new HtmlRspackPlugin({
			title: 'IF - GTD for prefessionals.',
			template: './public/index.html'
			// scriptLoading: is_prod ? 'defer' : 'module'
		}),
		!is_prod && new ReactRefreshPlugin()
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				type: 'javascript/auto',
				use: {
					loader: 'builtin:swc-loader',
					options: {
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
							},
							externalHelpers: true
						},
						env: {
							targets: 'chrome >= 120'
						}
					}
				}
			},
			{
				test: /\.global\.css$/,
				type: 'css',
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['postcss-nested']
							}
						}
					}
				]
			},
			{
				test: /\.css$/,
				type: 'css/module',
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
				]
			},
			{
				test: /\.(png|svg|jpg)$/,
				type: 'asset/source'
			}
		]
	}
})
