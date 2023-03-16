import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import Services from './services'

import type { DirTree } from '@/types'

@injectable()
export default class Index {
	current_item = ''
	modal_type = 'file' as DirTree.Type
	fold_all = false

	constructor(public services: Services) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	onOptions(type: 'rename' | 'delete') {
		match(type)
			.with('rename', () => (this.services.modal_open = true))
			.with('delete', () => this.services.delete())
			.exhaustive()
	}
}
