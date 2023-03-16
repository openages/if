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
		| 'kanban'
		| 'flow'
		| 'board'
            | 'project'
		| 'table'
		| 'bi'
            | 'ppt'
		| 'schedule'
		| 'habbit'
      
	/** @maxLength 12 */
	export type RealModuleType = Exclude<ModuleType, 'widgets'>
	export type Locales = Flatten<ObjectLocales>
	export type LocaleKeys = keyof Locales
}
