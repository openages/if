export namespace DirTree {
	type Common = {
		id: string
		name: string
		icon?: string
		icon_hue?: number
	}

	export type Type = 'dir' | 'file'

	// 注意：如果重新构建module的Schema，需将Dir.Children:Array<Item> => Dir.Children:Array<File>
	// 避免无限递归报错

	export type Dir = Common & {
		type: 'dir'
		children: Array<File>
		// // children: Array<Item>
	}

	export type File = Common & {
		type: 'file'
	}

	export type Item = Dir | File
	export type Items = Array<Item>
}
