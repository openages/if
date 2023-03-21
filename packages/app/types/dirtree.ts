export namespace DirTree {
	type Common = {
		id: string
		name: string
		icon?: string
	}

	export type Type = 'dir' | 'file'

	export type Dir = Common & {
		type: 'dir'
		children: Array<Item>
	}

	export type File = Common & {
		type: 'file'
	}

	export type DirsItem = Common & {
		type: 'dir'
		children: Array<Dir>
	}

	export type Dirs = Array<DirsItem>

	export type Item = Dir | File
	export type Items = Array<Item>
}
