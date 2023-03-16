import { dirtree, nav_title, setting } from './en-US/index'

const locales = {
	nav_title,
      setting,
      dirtree
} as const

export type ObjectLocales = typeof locales
