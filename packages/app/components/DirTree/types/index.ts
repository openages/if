import type { CSSProperties } from 'react'

import type { DirTree } from '@/types'

import type Model from '../model'
import type { App } from '@/types'
import type { MouseEvent } from 'react'

export interface IProps {
	module: App.RealModuleType
	height?: CSSProperties['height']
	onClick: (v: string) => void
}

export interface IPropsDirItems {
	module: App.RealModuleType
	data: Model['services']['doc']['dirtree']
	current_item: string
	fold_all: Model['fold_all']
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
	showDirTreeOptions: (e: MouseEvent<HTMLDivElement>, v: DirTree.Item) => void
}

export type IPropsDirItem = {
	module: App.RealModuleType
	item: DirTree.Item
	current_item: string
	fold_all: Model['fold_all']
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
	showDirTreeOptions: IPropsDirItems['showDirTreeOptions']
}

export interface IPropsActions {
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsModal {
	modal_open: Model['modal_open']
	modal_type: Model['modal_type']
	current_option: Model['current_option']
	focusing_item: Model['focusing_item']
	add: Model['add']
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	resetFocusingItem: () => void
	rename: Model['rename']
}

export interface IPropsOptions {
	focusing_item: Model['focusing_item']
	onOptions: Model['onOptions']
}
