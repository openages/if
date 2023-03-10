import { locale_options } from '@/appdata'

import type { ObjectLocales } from '@/locales/_types'

import type { Flatten } from '@matrixages/knife/types'

export namespace App {
	export type LocaleType = (typeof locale_options)[number]['value']
	export type MuduleType =
		| 'todo'
		| 'memo'
		| 'note'
		| 'table'
		| 'ppt'
		| 'pomodoro'
		| 'plan'
		| 'schedule'
		| 'kanban'
		| 'flow'
		| 'board'
		| 'project'
	export type Locales = Flatten<ObjectLocales>
	export type LocaleKeys = keyof Locales
}
