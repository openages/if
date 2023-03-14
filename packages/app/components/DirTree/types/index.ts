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
	data: Model['services']['doc']['dirtree']
	current_item: string
	fold_all: Model['fold_all']
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
	showDirTreeOptions: (e: MouseEvent<HTMLDivElement>, v: DirTree.Item) => void
}

export type IPropsDirItem = {
	item: DirTree.Item
	current_item: string
	fold_all: Model['fold_all']
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
	showDirTreeOptions: IPropsDirItems['showDirTreeOptions']
}

export interface IPropsActions {
	setModalOpen: (v: Model['services']['modal_open'], type?: Model['modal_type']) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsModal {
	modal_open: Model['services']['modal_open']
	modal_type: Model['modal_type']
	add: Model['services']['add']
	setModalOpen: (v: Model['services']['modal_open'], type?: Model['modal_type']) => void
}

export interface IPropsOptions {
	focusing_item: Model['services']['focusing_item']
}
