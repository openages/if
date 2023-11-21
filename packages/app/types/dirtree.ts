export namespace DirTree {
	export type Item = {
            type: 'dir'| 'file'
		id: string
		name: string
		pid?: string
		icon?: string
		icon_hue?: number
      }
      
	export type Items = Array<Item>
}
