import { remove } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { loading } from '@/utils/decorators'
import { setStorageWhenChange, useInstanceWatch } from '@openages/craftkit'

import { getQuery, create, query, updateDirtree, updateItem, removeItem } from './services'
import { move } from './utils'

import type { App, Module, DirTree } from '@/types'
import type { Active, Over } from '@dnd-kit/core'
import type { IProps } from './types'
import type { Item } from './types/services'
import type { RxDocument } from 'rxdb'
import type { Subscription } from 'rxjs'
import type { Watch } from '@openages/craftkit'

@injectable()
export default class Index {
	module = '' as App.ModuleType
	actions = {} as IProps['actions']
	doc = {} as Module.Item
	doc_watcher = null as Subscription
	focusing_item = {} as DirTree.Item
	current_item = {} as DirTree.File
	modal_type = 'file' as DirTree.Type
	current_option = '' as 'rename' | 'add_file' | 'add_dir' | ''
	open_folder = [] as Array<string>
	modal_open = false

	watch = {
		current_item: (v) => this.onClick(v)
	} as Watch<Index>

	constructor(public utils: Utils) {
		makeAutoObservable(this, { watch: false }, { autoBind: true })
	}

	async init(args: { module: App.ModuleType; actions: IProps['actions'] }) {
		const { module, actions } = args

		this.utils.acts = [...useInstanceWatch(this)]
		this.module = module
		this.actions = actions

		const disposer = setStorageWhenChange(
			[
				{ [`${this.module}_active_file`]: 'current_item' },
				{ [`${this.module}_open_folder`]: 'open_folder' }
			],
			this
		)

		this.on()
		this.watchDoc()

		this.query()

		this.onClick(this.current_item)

		this.utils.acts.push(disposer)
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

		const target = move(toJS(this.doc).dirtree, active, over)

		if (!target) return

		this.updateDirtree(target)
	}

	async onOptions(type: 'add_dir' | 'add_file' | 'rename' | 'delete') {
		if (type === 'add_dir' || type === 'add_file' || type === 'rename') {
			this.current_option = type
			this.modal_open = true
		} else {
			await removeItem({
				module: this.module,
				focusing_item: this.focusing_item,
				actions: this.actions,
				current_item_id: this.current_item.id
			})

			if (this.current_item.id === this.focusing_item.id) {
				this.current_item = {} as DirTree.File
			}

			this.focusing_item = {} as DirTree.Item
		}
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

	@loading
	async create(item: Item) {
		await create({
			module: this.module,
			focusing_item: this.focusing_item,
			actions: this.actions,
			item
		})

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	@loading
	async query() {
		const doc = await query(this.module)

		this.doc = doc.toMutableJSON()
	}

	async updateDirtree(data: DirTree.Items) {
		await updateDirtree({
			module: this.module,
			data
		})
	}

	@loading
	async updateItem(item: Partial<DirTree.Item>) {
		await updateItem({
			module: this.module,
			focusing_item: this.focusing_item,
			item
		})

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	watchDoc() {
		this.doc_watcher = getQuery(this.module).$.subscribe((doc: RxDocument<Module.Item>) => {
			this.doc = doc.toMutableJSON()
		})
	}

	on() {
		$app.Event.on(`${this.module}/dirtree/move`, this.move)
		$app.Event.on(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.on(`${this.module}/dirtree/setCurrentItem`, this.setCurrentItem)
		$app.Event.on(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.on(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
		$app.Event.on(`${this.module}/dirtree/updateItem`, this.updateItem)
	}

	off() {
		this.utils.off()
		this.doc_watcher?.unsubscribe?.()

		$app.Event.off(`${this.module}/dirtree/move`, this.move)
		$app.Event.off(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.off(`${this.module}/dirtree/setCurrentItem`, this.setCurrentItem)
		$app.Event.off(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.off(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
		$app.Event.off(`${this.module}/dirtree/updateItem`, this.updateItem)
	}
}
