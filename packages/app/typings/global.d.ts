import type { App } from '@/types'
import type { Doc } from '@/types'

import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

type $CX = (...args: Array<string | boolean | null | undefined>) => string

declare global {
	interface Window {
		$shell?: {
			type: 'electron'
			platform: 'android' | 'darwin' | 'linux' | 'win32'
			stopLoading: () => void
		}

		$cx: $CX
		$app: $App
		$l: App.Locales
		$locale: App.LocaleType
		$db: PouchDB.Database<Doc.Content>
		$message: MessageInstance
		$notification: NotificationInstance
		$modal: Omit<ModalStaticFunctions, 'warn'>
	}

	let $cx: $CX
	let $app: $App
	let $l: App.Locales
	let $locale: App.LocaleType
	let $db: PouchDB.Database<Doc.Content>
	let $message: MessageInstance
	let $notification: NotificationInstance
	let $modal: Omit<ModalStaticFunctions, 'warn'>
}

export {}
