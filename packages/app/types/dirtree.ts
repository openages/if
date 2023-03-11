export namespace DirTree {
	type Common = {
		_id: string
		name: string
		icon?: string
	}

	export type Type = 'dir' | 'file'

	export type Dir<T = {}> = Common & {
		type: 'dir'
		children: Array<File<T>>
	}

	export type File<T = {}> = Common & {
		type: 'file'
		desc?: string
		data: T
	}

	export type Item<T = {}> = Dir<T> | File<T>
}
