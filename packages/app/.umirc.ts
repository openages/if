import { defineConfig } from '@umijs/max'

import {
	conventionRoutes,
	extraPostCSSPlugins,
	getLinks,
	proxy,
	sp_build_config,
	srcTranspilerOptions
} from './build/config'

export default defineConfig({
	title: 'IF - GTD for professionals.',
	npmClient: 'pnpm',
	srcTranspiler: 'swc',
	jsMinifier: 'swc',
	publicPath: sp_build_config.base,
	history: { type: sp_build_config.history_type },
      links: getLinks(),
	monorepoRedirect: { srcDir: ['./'] },
	mfsu: { esbuild: false, strategy: 'eager' },
	codeSplitting: { jsStrategy: 'granularChunks' },
	locale: { default: 'en-US', antd: true, baseNavigator: true },
	test: false,
	valtio: false,
	helmet: false,
	proxy,
	conventionRoutes,
	srcTranspilerOptions,
	extraPostCSSPlugins
})
