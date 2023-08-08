import { en_US } from '@/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: typeof en_US
	}
}
