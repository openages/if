import { resolve } from 'path'

import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import { defineConfig } from '@rspack/cli'
import { CopyRspackPlugin, HtmlRspackPlugin } from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'

const is_dev = process.env.NODE_ENV === 'development'
const is_prod = process.env.NODE_ENV === 'production'
const is_module = false

const plugins_dev = [
	new ReactRefreshPlugin({
		exclude: [/node_modules/]
	})
]
const plugins_prod = [
	new RsdoctorRspackPlugin(),
	new CopyRspackPlugin({
		patterns: [{ from: './public', to: './', globOptions: { ignore: ['**/index.html'] } }]
	})
]

module.exports = defineConfig({
	devtool: is_dev ? 'source-map' : false,
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
		tsConfigPath: resolve(__dirname, 'tsconfig.json'),
		alias: process.env.DOCTOR && {
			tslib: resolve(__dirname, 'node_modules/tslib')
		}
	},
	devServer: {
		compress: false
	},
	node: {
		global: false
	},
	experiments: {
		outputModule: is_module,
		rspackFuture: {}
	},
	plugins: [
		new HtmlRspackPlugin({
			title: 'IF - GTD for prefessionals.',
			template: './public/index.html',
			scriptLoading: is_module ? 'module' : 'defer'
		}),
		...(is_dev ? plugins_dev : plugins_prod)
	],
	ignoreWarnings: [/Conflicting order/],
	module: {
		parser: {
			css: { namedExports: false },
			'css/module': { namedExports: false }
		},
		rules: [
			{
				test: /\.ts$/,
				use: {
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'typescript',
								dynamicImport: true,
								exportDefaultFrom: true,
								exportNamespaceFrom: true,
								decorators: true
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true
							},
							minify: {
								compress: {
									drop_console: is_prod
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
				test: /\.tsx$/,
				exclude: [/[\\/]node_modules[\\/]/],
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
									development: is_dev,
									refresh: is_dev,
									runtime: 'automatic',
									useBuiltins: true
								}
							},
							minify: {
								compress: {
									drop_console: is_prod
								}
							},
							externalHelpers: true,
							experimental: {
								plugins: [['swc-plugin-jsx-control-statements', {}]]
							}
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
