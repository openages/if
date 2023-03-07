import { nav_title, setting } from './en-US/index'

const locales = {
	nav_title,
	setting
} as const

export type ObjectLocales = typeof locales
