import type { CSSProperties } from 'react'

import type { DirTree } from '@/types'

import type Model from '../model'
import type { MouseEvent, ReactNode } from 'react'

export interface IProps {
	module: Model['module']
	height?: CSSProperties['height']
	actions: {
		add: (file_id: string, data: Partial<Omit<DirTree.Item, 'id'>>) => Promise<void>
		remove: (focusing_item: DirTree.Item, current_item_id: string, module: string) => Promise<void>
	}
}

export interface IPropsDirItems {
	module: Model['module']
	data: Model['items']
	loading: boolean
	current_item: DirTree.Item
	focusing_item: Model['focusing_item']
	open_folder: Model['open_folder']
	onClick: (v: DirTree.Item) => void
	showDirTreeOptions: (e: MouseEvent<HTMLElement>, v: DirTree.Item) => void
}

export interface IPropsDirItem {
	module: Model['module']
	item: Omit<DirTree.Item, 'sort'>
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
	create: Model['create']
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
