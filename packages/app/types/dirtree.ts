export namespace DirTree {
	type Common = {
            id: string
		name: string
		icon?: string
	}

	export type Type = 'dir' | 'file'

	export type Dir = Common & {
            type: 'dir'
		children: Array<File>
	}

	export type File = Common & {
		type: 'file'
		counts?: number
	}

	export type Item = Dir | File
	export type Items = Array<Item>
}
