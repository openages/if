import type { App, DirTree } from '@/types'
import type { IProps } from './index'

export type Item = { type: 'dir'; data: Partial<DirTree.Item> } | { type: 'file'; data: Partial<DirTree.Item> }

export type ArgsCreate = {
	module: App.ModuleType
	focusing_item: DirTree.Item
	actions: IProps['actions']
	item: Item
}

export type ArgsUpdateDirtree = {
	module: App.ModuleType
	data: DirTree.Items
}

export type ArgsUpdateItem = {
	module: App.ModuleType
      focusing_item: DirTree.Item
	item: Partial<DirTree.Item>
}

export type ArgsRemove = {
	module: App.ModuleType
	focusing_item: DirTree.Item
	actions: IProps['actions']
	current_item_id: string
}
