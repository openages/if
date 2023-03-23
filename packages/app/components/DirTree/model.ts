import { makeAutoObservable, toJS } from 'mobx'
import { contextMenu } from 'react-contexify'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { loading } from '@/utils/decorators'
import { arrayMove } from '@dnd-kit/sortable'

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
	current_option = '' as 'rename' | 'add_file' | 'add_dir' | ''

	constructor(public utils: Utils, public services: Services) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType) {
		this.module = module

		this.on()

		await this.services.init(module)
	}

	@loading
	async add(type: DirTree.Type, name: string, icon: string) {
		await this.services.add(this.focusing_item, type, name, icon)

		this.modal_open = false
	}

	@loading
	async rename(v: string, icon: string) {
		await this.services.rename(this.focusing_item, v, icon)

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	update(v: DirTree.Items) {
		this.services.dirtree = v
	}

	moveTo(target_id: string) {
		contextMenu.hideAll()

		this.services.moveTo(this.focusing_item, target_id)
	}

	move(args: { active_id: string; over_id: string }) {
		const { active_id, over_id } = args

		const active_index = this.services.dirtree.findIndex((item) => item.id === active_id)
		const over_index = this.services.dirtree.findIndex((item) => item.id === over_id)

		this.services.dirtree = arrayMove(this.services.dirtree, active_index, over_index)
	}

	onOptions(type: 'add_file' | 'add_dir' | 'rename' | 'delete') {
		match(type)
			.with('add_file', () => {
				this.current_option = 'add_file'
				this.modal_open = true
			})
			.with('add_dir', () => {
				this.current_option = 'add_dir'
				this.modal_open = true
			})
			.with('rename', () => {
				this.current_option = 'rename'
				this.modal_open = true
			})
			.with('delete', () => this.services.delete(this.focusing_item))
			.exhaustive()
	}

	on() {
		$app.Event.on(`${this.module}/dirtree/move`, this.move)
	}

	off() {
		$app.Event.off(`${this.module}/dirtree/move`, this.move)
	}
}
