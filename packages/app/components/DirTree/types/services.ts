import type { App, DirTree } from '@/types'
import type { IProps } from './index'

export type ArgsCreate = {
	module: App.ModuleType
	focusing_item: DirTree.Item
	actions: IProps['actions']
	item: Partial<DirTree.Item>
}

export type ArgsUpdate = {
	focusing_item: DirTree.Item
	item: Partial<DirTree.Item>
}

export type ArgsRemove = {
	module: App.ModuleType
	focusing_item: DirTree.Item
	actions: IProps['actions']
	current_item_id: string
}
