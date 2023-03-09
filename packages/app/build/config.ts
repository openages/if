import PostCssNested from 'postcss-nested'
import { match } from 'ts-pattern'

import type { JscConfig } from '@swc/core'
import type { BuildTarget, SpBuildConfig } from '@/types'

export const sp_build_config = match<BuildTarget, SpBuildConfig>(process.env.BUILD_TARGET as BuildTarget)
	.with('electron', () => ({ base: './', history_type: 'hash' }))
	.with('cordova', () => ({ base: './', history_type: 'hash' }))
	.otherwise(() => ({ base: '/', history_type: 'browser' }))

export const conventionRoutes = {
	exclude: [
		/model\.(j|t)sx?$/,
		/services\.(j|t)sx?$/,
		/types\.(j|t)sx?$/,
		/hooks\.(j|t)sx?$/,
		/locales\.(j|t)sx?$/,
		/components\//,
		/model\//,
		/types\//,
		/hooks\//,
            /locales\//,
            /services\//,
		/_(.*)$/
	]
}

export const proxy = {
	'/api': {
		target: 'http://localhost:6666',
		changeOrigin: true
	}
}

export const getLinks = () => {
	const links = [
		{ id: 'favicon', rel: 'icon', type: 'image/svg+xml', href: `logo.svg` },
		{ rel: 'preload', href: `icon_font.css`, as: 'style' },
		{ rel: 'preload', href: `styles/init.css`, as: 'style' },
		{ rel: 'preload', href: `styles/atom.min.css`, as: 'style' },
		{ rel: 'preload', href: `theme/common.css`, as: 'style' },
		{ rel: 'preload', href: `theme/light.css`, as: 'style' },
		{ rel: 'preload', href: `theme/dark.css`, as: 'style' },
		{ rel: 'stylesheet', href: `icon_font.css` },
		{ rel: 'stylesheet', href: `styles/init.css` },
		{ rel: 'stylesheet', href: `styles/atom.min.css` },
		{ rel: 'stylesheet', href: `theme/common.css` },
		{ rel: 'stylesheet', href: `theme/light.css` },
		{ rel: 'stylesheet', href: `theme/dark.css` }
	]

	return links.map((item) => {
		item.href = `${sp_build_config.base}${item.href}`

		return item
	})
}

const sp_jsc_config = process.platform === 'win32' && process.env.NODE_ENV === 'development' ? { target: 'es2022' } : {}

export const srcTranspilerOptions = {
	swc: {
		jsc: Object.assign(
			{
				parser: { syntax: 'typescript', tsx: true, decorators: true, topLevelAwait: true },
				transform: { legacyDecorator: true, decoratorMetadata: true }
			} as JscConfig,
			sp_jsc_config
		)
	}
}

export const extraPostCSSPlugins = [PostCssNested()]
