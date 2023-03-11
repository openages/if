import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import type { Type, Item, CurrentItem } from './types'
import type { App } from '@/types'

@injectable()
export default class Index {
	module = '' as App.MuduleType
	items = [] as Array<Item>
	current_item = {} as CurrentItem
	modal_open = false
	modal_type = 'file' as Type
	fold_all = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	add(type: Type) {}
}
