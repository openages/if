import { en } from '@/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: typeof en
	}
}
