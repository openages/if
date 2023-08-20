import { modules } from '@/appdata'

import type { DirTree } from './dirtree'

export namespace App {
	export type ModuleType = (typeof modules)[number]['title']
	// build:schema 时使用下列配置
	// /** @maxLength 30 */
	// export type ModuleType =
	// 	| 'todo'
	// 	| 'memo'
	// 	| 'note'
	// 	| 'kanban'
	// 	| 'flow'
	// 	| 'whiteboard'
	// 	| 'table'
	// 	| 'form'
	// 	| 'chart'
	// 	| 'ppt'
	// 	| 'schedule'
	// 	| 'pomodoro'
	// 	| 'habbit'
	// 	| 'api'
	// 	| 'metatable'
	// 	| 'metaform'
	// 	| 'metachart'
	// 	| 'setting'

	export interface Module {
		title: App.ModuleType
		path: string
		is_fixed?: boolean
	}

	export type Modules = Array<Module>

	export interface Stack {
		id: DirTree.File['id']
		module: App.ModuleType
		file: DirTree.File
		is_active: boolean
		is_fixed: boolean
	}

	export type Stacks = Array<Stack>
}
