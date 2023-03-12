export namespace DirTree {
	type Common = {
		_id: string
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
		target_id: string
		desc?: string
	}

	export type Item = Dir | File
	export type Items = Array<Item>
}
