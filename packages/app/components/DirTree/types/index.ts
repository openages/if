import type { CSSProperties } from 'react'

import type { File, Dir, Item, ActiveItem } from './dirtree'
import type Model from '../model'

export * from './dirtree'

export interface IProps {
	items: Array<Item>
	activeItem: ActiveItem
	height?: CSSProperties['height']
	onClick: (v: ActiveItem) => void
	addFile: (title: File['title']) => void
	addDir: (title: Dir['title']) => void
}

export type IPropsDirItem = Item & {
	parent: Item['id'] | null
	activeItem: IProps['activeItem']
	fold_all: Model['fold_all']
	onClick: (args: ActiveItem) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsActions {
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
	setFoldAll: (v: Model['fold_all']) => boolean
}

export interface IPropsModal {
	modal_open: Model['modal_open']
	modal_type: Model['modal_type']
	addFile: IProps['addFile']
      addDir: IProps[ 'addDir' ]
	setModalOpen: (v: Model['modal_open'], type?: Model['modal_type']) => void
}
