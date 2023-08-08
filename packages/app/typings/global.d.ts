import type { App, RxDB } from '@/types'
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

            $is_dev:boolean

		$cx: $CX
		$app: $App
		$l: App.Locales
		$locale: App.LocaleType
		$db: RxDB.DBContent
		$message: MessageInstance
		$notification: NotificationInstance
		$modal: Omit<ModalStaticFunctions, 'warn'>
	}
      
      let $is_dev: boolean
      
	let $cx: $CX
	let $app: $App
	let $l: App.Locales
	let $locale: App.LocaleType
	let $db: RxDB.DBContent
	let $message: MessageInstance
	let $notification: NotificationInstance
	let $modal: Omit<ModalStaticFunctions, 'warn'>
}

export {}
