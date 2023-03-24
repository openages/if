import type { CSSProperties } from 'react'

import type { DirTree } from '@/types'

import type Model from '../model'
import type { MouseEvent } from 'react'
import type { SensorDescriptor, SensorOptions } from '@dnd-kit/core'

export interface IProps {
	module: Model['module']
	height?: CSSProperties['height']
	onClick: (v: string) => void
}

export interface IPropsDirItems {
	module: Model['module']
	data: Model['services']['doc']['dirtree']
	current_item: string
	fold_all: Model['fold_all']
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
	showDirTreeOptions: (e: MouseEvent<HTMLDivElement>, v: DirTree.Item) => void
}

export type IPropsDirItem = {
	module: Model['module']
	item: DirTree.Item
	current_item: string
	fold_all: Model['fold_all']
	sensors: Array<SensorDescriptor<SensorOptions>>
	depth?: number
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
	showDirTreeOptions: IPropsDirItems['showDirTreeOptions']
}

export interface IPropsActions {
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsModal {
	module: Model['module']
	modal_open: Model['modal_open']
	modal_type: Model['modal_type']
	current_option: Model['current_option']
	focusing_item: Model['focusing_item']
	loading_add: boolean
	loading_rename: boolean
	add: Model['add']
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	resetFocusingItem: () => void
	rename: Model['rename']
}

export interface IPropsOptions {
	dirs: DirTree.Dirs
	focusing_item: Model['focusing_item']
	onOptions: Model['onOptions']
	moveTo: Model['moveTo']
}

export interface IPropsDirs {
	item: DirTree.DirsItem
	moveTo: Model['moveTo']
}

export interface IPropsLeftIcon {
	module: Model['module']
	item: DirTree.Item
}
