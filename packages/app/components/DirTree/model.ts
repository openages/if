import { remove } from 'lodash-es'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { setStorageWhenChange } from '@/utils'
import { loading } from '@/utils/decorators'

import Services from './services'
import { move } from './utils'

import type { App, DirTree } from '@/types'
import type { Active, Over } from '@dnd-kit/core'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	modal_open = false
	focusing_item = {} as DirTree.Item
	current_item = ''
	modal_type = 'file' as DirTree.Type
	current_option = '' as 'rename' | 'add_file' | 'add_dir' | ''
	open_folder = [] as Array<string>

	constructor(
		public utils: Utils,
		public services: Services
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType) {
		this.module = module

		setStorageWhenChange(
			[{ [`${this.module}_active_id`]: 'current_item' }, { [`${this.module}_open_folder`]: 'open_folder' }],
			this
		)

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
		this.focusing_item = {} as DirTree.Item
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

		console.log(target[0].children)

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
			.with('delete', async () => {
				await this.services.delete(this.current_item)

				if (this.current_item === this.focusing_item.id) {
					this.current_item = ''
				}

				this.focusing_item = {} as DirTree.Item
			})
			.exhaustive()
	}

	removeCurrentItem() {
		this.current_item = ''
	}

	addOpenFolder(id: string) {
		this.open_folder.push(id)
	}

	removeOpenFolder(id: string) {
		remove(this.open_folder, (item) => item === id)
	}

	on() {
		$app.Event.on(`${this.module}/dirtree/move`, this.move)
		$app.Event.on(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.on(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.on(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
	}

	off() {
		$app.Event.off(`${this.module}/dirtree/move`, this.move)
		$app.Event.off(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.off(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.off(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
	}
}
