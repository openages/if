import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Services from './services'

import type { DirTree } from '@/types'
import type { App } from '@/types'

@injectable()
export default class Index {
	current_item = ''
	modal_type = 'file' as DirTree.Type
	fold_all = false

	constructor(public services: Services) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
