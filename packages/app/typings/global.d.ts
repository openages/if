import type { App, RxDB } from '@/types'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'
import type { TFunction } from 'i18next'
import type {} from 'react-i18next'

type $CX = (...args: Array<string | boolean | null | undefined>) => string

declare global {
	interface Window {
		$shell?: {
			type: 'electron'
			platform: 'android' | 'darwin' | 'linux' | 'win32'
			stopLoading: () => void
		}

		$is_dev: boolean

		$t: TFunction<'translation', undefined>
		$cx: $CX

		$app: $App
		$locale: App.LocaleType
		$db: RxDB.DBContent
		$message: MessageInstance
		$notification: NotificationInstance
		$modal: Omit<ModalStaticFunctions, 'warn'>
	}

	let $is_dev: boolean

	let $t: TFunction<'translation', undefined>
	let $cx: $CX

	let $app: $App
	let $locale: App.LocaleType
	let $db: RxDB.DBContent
	let $message: MessageInstance
	let $notification: NotificationInstance
	let $modal: Omit<ModalStaticFunctions, 'warn'>
}

export {}
