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

export type Item = Dir | File
export type ActiveItem = { parent: Common['id'] | null; id: Common['id']; metadata?: Common['metadata'] }