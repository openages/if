import { locale_options } from '@/appdata'

import type { ObjectLocales } from '@/locales/_types'

import type { Flatten } from '@matrixages/knife/types'

export namespace App {
	export type LocaleType = (typeof locale_options)[number]['value']
	export type ModuleType =
		| 'todo'
		| 'memo'
		| 'note'
		| 'pomodoro'
		| 'widgets'
		| 'schedule'
		| 'kanban'
		| 'flow'
		| 'board'
		| 'project'
            | 'table'
		| 'bi'
		| 'ppt'
	export type Locales = Flatten<ObjectLocales>
	export type LocaleKeys = keyof Locales
}
