import type { CSSProperties } from 'react'

import type { DirTree } from '@/types'

import type { MouseEvent, ReactNode } from 'react'
import type Model from '../model'

export interface IProps {
	module: Model['module']
	actions: {
		insert: (file_id: string) => Promise<any>
		remove: (focusing_item: DirTree.Item) => Promise<any>
	}
	height?: CSSProperties['height']
	simple?: boolean
}

export interface IPropsContent {
	dirtree_width: number
	simple: boolean
	height: string | number
	props_search: IPropsSearch
	props_dir_items: IPropsDirItems
	props_actions: IPropsActions
	props_modal: IPropsModal
	props_options: IPropsOptions
}

export interface IPropsSearch {
	showSearch: () => void
}

export interface IPropsDirItems {
	module: Model['module']
	data: Model['node_tree']['tree']
	loading: boolean
	current_item: DirTree.Item
	focusing_item: Model['focusing_item']
	open_folder: Model['open_folder']
	onClick: (v: DirTree.Item) => void
	showDirTreeOptions: (e: MouseEvent<HTMLElement>, v: Model['focusing_index']) => void
}

export interface IPropsDirItem {
	module: Model['module']
	item: DirTree.Item
	current_item: DirTree.Item
	focusing_item: Model['focusing_item']
	open_folder?: Model['open_folder']
	parent_index?: Array<number>
	dragging?: boolean
	onClick: IPropsDirItems['onClick']
	showDirTreeOptions: IPropsDirItems['showDirTreeOptions']
}

export interface IPropsDirItem_File extends IPropsDirItem {}

export interface IPropsDirItem_Dir extends IPropsDirItem {}

export interface IPropsDirItem_Item extends IPropsDirItem {
	open?: boolean
}

export interface IPropsDirItem_SortableWrap extends Pick<IPropsDirItem, 'item' | 'parent_index'> {
	children: ReactNode
}

export interface IPropsActions {
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
}

export interface IPropsModal {
	module: Model['module']
	modal_open: Model['modal_open']
	modal_type: Model['modal_type']
	current_option: Model['current_option']
	focusing_item: Model['focusing_item']
	loading_create: boolean
	loading_updateItem: boolean
	insert: Model['insert']
	update: Model['update']
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	resetFocusingItem: () => void
}

export interface IPropsOptions {
	focusing_item: Model['focusing_item']
	onOptions: Model['onOptions']
	resetFocusingItem: () => void
}

export interface IPropsLeftIcon {
	module: Model['module']
	item: DirTree.Item
	size?: number
}
