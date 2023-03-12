import { DirTree } from '@/types'

export namespace Doc {
	export type Res<T> = T & {
		_id: string
		_rev: string
	}

	export type Module = Res<{
		data: DirTree.Items
	}>
}
