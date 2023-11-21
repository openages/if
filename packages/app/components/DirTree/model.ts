import { remove as lodash_remove } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { loading } from '@/utils/decorators'
import { getDocItemsData } from '@/utils/rxdb'
import { setStorageWhenChange, useInstanceWatch } from '@openages/stk'

import { getQuery, query, create, update, remove } from './services'
import { move, transform } from './utils'

import type { App, DirTree } from '@/types'
import type { Active, Over } from '@dnd-kit/core'
import type { IProps } from './types'
import type { Subscription } from 'rxjs'
import type { Watch } from '@openages/stk'

@injectable()
export default class Index {
	module = '' as App.ModuleType
	actions = {} as IProps['actions']
	items = [] as Array<DirTree.Item>
	items_watcher = null as Subscription
	focusing_item = {} as DirTree.Item
	current_item = {} as DirTree.Item
	modal_type = 'file' as DirTree.Item['type']
	current_option = '' as 'rename' | 'add_file' | 'add_dir' | ''
	open_folder = [] as Array<string>
	modal_open = false

	watch = {
		current_item: (v) => this.onClick(v)
	} as Watch<Index>

	get data() {
		return transform(this.items)
	}

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

	@loading
	async query() {
		const doc = await query(this.module)

		this.items = getDocItemsData(doc)
	}

	@loading
	async create(item: Partial<DirTree.Item>) {
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
	async update(item: Partial<DirTree.Item>) {
		await update({ focusing_item: this.focusing_item, item })

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	async onOptions(type: 'add_dir' | 'add_file' | 'rename' | 'delete') {
		if (type === 'add_dir' || type === 'add_file' || type === 'rename') {
			this.current_option = type
			this.modal_open = true
		} else {
			await remove({
				module: this.module,
				focusing_item: this.focusing_item,
				actions: this.actions,
				current_item_id: this.current_item.id
			})

			if (this.current_item.id === this.focusing_item.id) {
				this.current_item = {} as DirTree.Item
			}

			this.focusing_item = {} as DirTree.Item
		}
	}

	onClick(v: DirTree.Item) {
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

		const target = move(this.items, active, over)

		if (!target) return

		this.items = target

		// this.updateDirtree(target)
	}

	setCurrentItem(v: DirTree.Item) {
		this.current_item = v
	}

	removeCurrentItem() {
		this.current_item = {} as DirTree.Item
	}

	addOpenFolder(id: string) {
		if (!this.open_folder.includes(id)) {
			this.open_folder.push(id)
		}
	}

	removeOpenFolder(id: string) {
		lodash_remove(this.open_folder, (item) => item === id)
	}

	watchDoc() {
		this.items_watcher = getQuery(this.module).$.subscribe((items) => {
			this.items = getDocItemsData(items)
		})
	}

	on() {
		$app.Event.on(`${this.module}/dirtree/move`, this.move)
		$app.Event.on(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.on(`${this.module}/dirtree/setCurrentItem`, this.setCurrentItem)
		$app.Event.on(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.on(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
		$app.Event.on(`${this.module}/dirtree/update`, this.update)
	}

	off() {
		this.utils.off()
		this.items_watcher?.unsubscribe?.()

		$app.Event.off(`${this.module}/dirtree/move`, this.move)
		$app.Event.off(`${this.module}/dirtree/removeCurrentItem`, this.removeCurrentItem)
		$app.Event.off(`${this.module}/dirtree/setCurrentItem`, this.setCurrentItem)
		$app.Event.off(`${this.module}/dirtree/addOpenFolder`, this.addOpenFolder)
		$app.Event.off(`${this.module}/dirtree/removeOpenFolder`, this.removeOpenFolder)
		$app.Event.off(`${this.module}/dirtree/update`, this.update)
	}
}
