import type { CSSProperties } from 'react'

import type { Item, CurrentItem } from './dirtree'
import type Model from '../model'
import type { App } from '@/types'

export * from './dirtree'

export interface IProps {
	module: App.MuduleType
	height?: CSSProperties['height']
	onClick: (v: CurrentItem) => void
}

export type IPropsDirItem = Item & {
	parent: Item['id'] | null
	current_item: CurrentItem
	fold_all: Model['fold_all']
	onClick: (args: CurrentItem) => void
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
