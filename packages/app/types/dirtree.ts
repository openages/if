export namespace DirTree {
      export type Item = {
            /** @maxLength 30 */
            module: string
		type: 'dir' | 'file'
		id: string
		name: string
		pid?: string
		icon?: string
		icon_hue?: number
	}

	export type Dir = Item & {
		children: Array<Item>
	}

	export type Items = Array<Item>
}
