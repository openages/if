import { dirtree, nav_title, setting, todo } from './en-US/index'

const locales = {
	nav_title,
      setting,
      dirtree,
      todo
} as const

export type ObjectLocales = typeof locales
