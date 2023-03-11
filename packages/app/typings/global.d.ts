import type { App } from '@/types'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'
import type PouchDB from 'pouchdb'

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
		$db: PouchDB.Database
		$message: MessageInstance
		$notification: NotificationInstance
		$modal: Omit<ModalStaticFunctions, 'warn'>
	}

	let $cx: $CX
	let $app: $App
	let $l: App.Locales
	let $db: PouchDB.Database
	let $message: MessageInstance
	let $notification: NotificationInstance
	let $modal: Omit<ModalStaticFunctions, 'warn'>
}

export {}
