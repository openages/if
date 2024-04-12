import { dependencies } from './package.json'

import type { ModuleFederationPluginOptions } from '@rspack/core'

export default {
	name: 'app',
	remotes: {
		editor: 'editor@http://localhost:2001/mf-manifest.json'
	},
	shared: {
		react: {
			singleton: true,
			requiredVersion: dependencies.react
		},
		'react-dom': {
			singleton: true,
			requiredVersion: dependencies['react-dom']
		}
	}
} as ModuleFederationPluginOptions
