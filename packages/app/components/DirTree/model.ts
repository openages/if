import { makeAutoObservable, reaction, toJS } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { loading } from '@/utils/decorators'
import { move } from '@/utils/tree'

import Services from './services'

import type { App, DirTree } from '@/types'
import type { Active, Over } from '@dnd-kit/core'

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
		this.reactions()

		await this.services.init(module)
	}

	reactions() {
		reaction(
			() => this.focusing_item,
			(v) => (this.services.focusing_item = v)
		)
	}

	@loading
	async add(type: DirTree.Type, name: string, icon: string) {
		await this.services.add(type, name, icon)

		this.modal_open = false
	}

	@loading
	async rename(v: string, icon: string) {
		await this.services.rename(v, icon)

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	move(args: { active: Active; over: Over }) {
		const { active, over } = args

		const target = move(toJS(this.services.dirtree), active, over)

		if (!target) return

		this.services.dirtree = target
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
			.with('delete', () => this.services.delete())
			.exhaustive()
	}

	on() {
		$app.Event.on(`${this.module}/dirtree/move`, this.move)
	}

	off() {
		$app.Event.off(`${this.module}/dirtree/move`, this.move)
	}
}
