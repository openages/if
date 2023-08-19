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
import type { IProps } from './types'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	modal_open = false
	focusing_item = {} as DirTree.Item
	current_item = {} as DirTree.File
	modal_type = 'file' as DirTree.Type
	current_option = '' as 'rename' | 'add_file' | 'add_dir' | ''
	open_folder = [] as Array<string>

	constructor(
		public utils: Utils,
		public services: Services
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType, actions: IProps['actions']) {
		this.module = module
		this.services.actions = actions

		setStorageWhenChange(
			[
				{ [`${this.module}_active_file`]: 'current_item' },
				{ [`${this.module}_open_folder`]: 'open_folder' }
			],
			this
		)

		this.on()
		this.reactions()

		this.onClick(this.current_item)

		await this.services.init(module)
	}

	reactions() {
		reaction(
			() => this.focusing_item,
			(v) => (this.services.focusing_item = v)
		)

		reaction(
			() => this.current_item,
			(v) => this.onClick(v)
		)
	}

	@loading
	async add(type: DirTree.Type, args: Partial<DirTree.Item>) {
		await this.services.add(type, args)

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	@loading
	async rename(args: Partial<DirTree.Item>) {
		await this.services.rename(args)

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	onClick(v: DirTree.File) {
		if (!v?.id) return

		$app.Event.emit('global.tabs.add', {
			id: v.id,
			module: this.module,
			file: v,
			is_active: true,
			is_fixed: false,
			outlet: null
		} as App.Stack)
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
			.with('delete', async () => {
				await this.services.delete(this.current_item.id)

				if (this.current_item.id === this.focusing_item.id) {
					this.current_item = {} as DirTree.File
				}

				this.focusing_item = {} as DirTree.Item
			})
			.exhaustive()
	}

	setCurrentItem(v: DirTree.File) {
		this.current_item = v
	}

	removeCurrentItem() {
		this.current_item = {} as DirTree.File
	}

	addOpenFolder(id: string) {
		if (!this.open_folder.includes(id)) {
			this.open_folder.push(id)
		}
	}

	removeOpenFolder(id: string) {
		remove(this.open_folder, (item) => item === id)
	}

	on() {
		$app.Event.on(`${this.module}/dirtree/move`, this.move)
		$app.Event.on(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.on(`${this.module}/dirtree/setCurrentItem`, this.setCurrentItem)
		$app.Event.on(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.on(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
		$app.Event.on(`${this.module}/dirtree/rename`, this.rename)
	}

	off() {
		this.services.dirtree_query?.$?.unsubscribe?.()

		$app.Event.off(`${this.module}/dirtree/move`, this.move)
		$app.Event.off(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.off(`${this.module}/dirtree/setCurrentItem`, this.setCurrentItem)
		$app.Event.off(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.off(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
		$app.Event.off(`${this.module}/dirtree/rename`, this.rename)
	}
}
