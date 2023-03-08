export type Common = {
	id: string | number
	title: string
	metadata?: any
}

export type Dir = Common & {
	type: 'dir'
	children: Array<File>
}

export type File = Common & {
	type: 'file'
	counts: number
	icon?: string
}

export type Type = 'dir' | 'file'
export type Item = Dir | File
export type ActiveItem = { parent: Common['id'] | null; id: Common['id']; metadata?: Common['metadata'] }
