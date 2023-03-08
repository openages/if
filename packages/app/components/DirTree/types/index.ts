import type { CSSProperties } from 'react'

import type { Item, ActiveItem } from './dirtree'

export * from './dirtree'

export interface IProps {
	items: Array<Item>
	activeItem: ActiveItem
	height?: CSSProperties['height']
	onClick: (v: ActiveItem) => void
}

export type IPropsDirItem = Item & {
	parent: Item['id'] | null
	activeItem: IProps['activeItem']
	onClick: (args: ActiveItem) => void
}

export interface IPropsDragLine {}
