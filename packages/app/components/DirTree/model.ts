import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { loading } from '@/utils/decorators'

import Services from './services'

import type { App, DirTree } from '@/types'
@injectable()
export default class Index {
	module = '' as App.RealModuleType
	modal_open = false
	focusing_item = {} as DirTree.Item
	current_item = ''
	modal_type = 'file' as DirTree.Type
	fold_all = false
	current_option = '' as 'rename' | 'add' | ''

	constructor(public utils: Utils, public services: Services) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType) {
		this.module = module

		await this.services.init(module)
	}

	@loading
	async add(type: DirTree.Type, name: string, with_context_menu?: boolean) {
		await this.services.add(this.focusing_item, type, name, with_context_menu)

		this.modal_open = false
	}

	@loading
	async rename(v: string) {
		await this.services.rename(this.focusing_item, v)

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	onOptions(type: 'rename' | 'delete' | 'add') {
		match(type)
			.with('rename', () => {
				this.current_option = 'rename'
				this.modal_open = true
			})
			.with('add', () => {
				this.current_option = 'add'
				this.modal_open = true
			})
			.with('delete', () => this.services.delete(this.focusing_item))
			.exhaustive()
	}
}
