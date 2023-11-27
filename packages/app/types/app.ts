import { modules } from '@/appdata'

import type { DirTree } from './dirtree'

export namespace App {
	export type ModuleType = (typeof modules)[number]['title']

	export interface Module {
		id: App.ModuleType
		title: App.ModuleType
		path: string
		is_fixed?: boolean
	}

	export type Modules = Array<Module>

	export interface Stack {
		id: DirTree.Item['id']
		module: App.ModuleType
		file: DirTree.Item
		is_active: boolean
		is_fixed: boolean
	}

	export type Stacks = Array<Stack>
}
