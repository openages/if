import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'
import { CopyRspackPlugin, HtmlRspackPlugin } from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'

const is_prod = process.env.NODE_ENV === 'production'

const prod_config = is_prod && defineConfig({ devtool: false })

module.exports = defineConfig({
	...(prod_config || {}),
	entry: {
		main: './runtime/index.tsx'
	},
	output: {
		clean: is_prod,
		publicPath: ''
	},
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		tsConfigPath: resolve(__dirname, 'tsconfig.json')
	},
	devServer: {
		compress: false
	},
	optimization: {
		splitChunks: { chunks: 'all', maxSize: 30000 }
	},
	experiments: {
		topLevelAwait: true,
		outputModule: true,
		rspackFuture: {
			// newTreeshaking: true,
		}
	},
	plugins: [
		new HtmlRspackPlugin({
			title: 'IF - GTD for prefessionals.',
			template: './public/index.html',
			scriptLoading: 'module'
		}),
		!is_prod && new ReactRefreshPlugin({ exclude: [/node_modules/] }),
		is_prod &&
			new CopyRspackPlugin({
				patterns: [{ from: './public', to: './', globOptions: { ignore: ['**/index.html'] } }]
			})
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				type: 'javascript/auto',
				use: {
					loader: 'builtin:swc-loader',
					options: {
						sourceMap: !is_prod,
						isModule: true,
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
								plugins: ['postcss-import', 'postcss-nested', 'postcss-calc']
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
								plugins: ['postcss-import', 'postcss-nested', 'postcss-calc']
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
