import type { CSSProperties } from 'react'

type Common = {
	id: string | number
	title: string
	metadata?: any
}

type Dir = Common & {
	type: 'dir'
	children: Array<File>
}

type File = Common & {
	type: 'file'
	counts: number
	icon?: string
}

type Item = Dir | File
export type ActiveItem = { parent: Common['id'] | null; id: Common['id']; metadata?: Common['metadata'] }
type OnClick = (args: ActiveItem) => void

export interface IProps {
	items: Array<Item>
	activeItem: ActiveItem
	height?: CSSProperties['height']
	onClick: (v:ActiveItem) => void
}

export type IPropsDirItem = Item & {
	parent: Item['id'] | null
	activeItem: IProps['activeItem']
	onClick: OnClick
}
