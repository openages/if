import type { CSSProperties } from 'react'

import type { DirTree } from '@/types'

import type Model from '../model'
import type { App } from '@/types'

export interface IProps {
	module: App.ModuleType
	height?: CSSProperties['height']
	onClick: (v: string) => void
}

export type IPropsDirItem = DirTree.Item & {
	current_item: string
	fold_all: Model['fold_all']
	onClick: (v: string) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsActions {
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsModal {
	modal_open: Model['modal_open']
	modal_type: Model['modal_type']
	add: Model['add']
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
}
