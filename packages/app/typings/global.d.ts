import { App } from '@/types'

type $CX = (...args: Array<string | boolean | null | undefined>) => string

declare global {
	interface Window {
		$shell?: {
			type: 'electron'
			platform: 'android' | 'darwin' | 'linux' | 'win32'
			stopLoading: () => void
		}

		$app: $App
		$l: App.Locales
		$cx: $CX
	}

	let $app: $App
	let $l: App.Locales
	let $cx: $CX
}

export {}
