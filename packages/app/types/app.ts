import type { ReactElement } from 'react'
import { DirTree } from './dirtree'

export namespace App {
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

	export interface Stack {
		id: DirTree.File['id']
		module: App.RealModuleType
		file: DirTree.File
		is_active: boolean
		is_fixed: boolean
		outlet: ReactElement | null
	}

	export type Stacks = Array<Stack>
}
