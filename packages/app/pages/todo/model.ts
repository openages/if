import { cloneDeep } from 'lodash-es'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { archive } from '@/actions/todo'
import { GlobalModel } from '@/context/app'
import { Utils, File, Loadmore } from '@/models'
import { getDocItemsData } from '@/utils'
import { loading } from '@/utils/decorators'

import {
	getQueryTodo,
	getQueryItems,
	create,
	queryItems,
	queryArchives,
	queryArchivesCounts,
	updateTodoData,
	check,
	updateRelations,
	restoreArchiveItem,
	removeArchiveItem,
	queryTodo
} from './services'

import type { ArgsCreate, ArgsUpdateTodoData } from './types/services'

import type { RxDB, Todo, TodoArchive } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'
import type { Subscription } from 'rxjs'

@injectable()
export default class Index {
	id = ''
	todo = {} as Todo.Data
	todo_watcher = null as Subscription
	items = [] as Array<Todo.TodoItem>
	items_watcher = null as Subscription
	archives = [] as Array<TodoArchive.Item>
	archive_counts = 0
	current_angle_id = ''
	visible_settings_modal = false
	visible_archive_modal = false
	timer: NodeJS.Timeout = null

	constructor(
		public global: GlobalModel,
		public utils: Utils,
		public file: File,
		public loadmore: Loadmore
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id

		this.on()
		this.watch()
		this.reactions()

		this.file.init(this.id)

		this.queryTodo()
		this.queryItems()
	}

	reactions() {
		reaction(
			() => this.current_angle_id,
			() => {
				if (!this.id) return

				this.queryItems()
			}
		)

		reaction(
			() => this.todo.angles,
			(v) => {
				if (!this.id) return
				if (!this.todo.id) return

				const exist = v.find((item) => item.id === this.current_angle_id)

				if (!exist) {
					this.current_angle_id = v[0].id
				}
			}
		)

		reaction(
			() => this.visible_archive_modal,
			(v) => {
				if (v) {
					this.queryArchives()
					this.queryArchivesCounts()
				} else {
					this.loadmore.page = 0
					this.loadmore.end = false
				}
			}
		)

		reaction(
			() => this.loadmore.page,
			(v) => {
				if (!v) return

				this.queryArchives()
			}
		)
	}

	@loading
	async create(item: Todo.TodoItem) {
		await create({
			file_id: this.id,
			angle_id: this.current_angle_id,
			item
		})
	}

	@loading
	async queryTodo() {
		const todo = await queryTodo(this.id)

		this.todo = todo.toMutableJSON()
	}

	@loading
	async queryItems() {
		await archive(this.id)

		const items = await queryItems(this.id, this.current_angle_id)

		this.items = getDocItemsData(items)

		if (this.items_watcher) {
			this.items_watcher.unsubscribe()

			this.watchItems()
		}
	}

	async queryArchives() {
		const items = (await queryArchives({
			file_id: this.id,
			page: this.loadmore.page
		})) as RxDB.ItemsDoc<TodoArchive.Item>

		if (items.length === 0) return (this.loadmore.end = true)

		if (this.loadmore.page === 0) {
			this.archives = getDocItemsData(items)
		} else {
			this.archives = this.archives.concat(getDocItemsData(items))
		}
	}

	async queryArchivesCounts() {
		this.archive_counts = await queryArchivesCounts(this.id)
	}

	async updateTodo(changed_values: ArgsUpdateTodoData['changed_values'], values: ArgsUpdateTodoData['values']) {
		await updateTodoData({
			file_id: this.id,
			todo: this.todo,
			changed_values,
			values,
			setTodo: (todo) => {
				this.todo = todo
			}
		})
	}

	async check(args: { id: string; status: Todo.Todo['status'] }) {
		await check({
			file_id: this.id,
			todo: this.todo,
			...args
		})

		await this.queryItems()
	}

	async updateRelations(active_id: string, over_id: string) {
		await updateRelations({
			file_id: this.id,
			todo: this.todo,
			items: this.items as Array<Todo.Todo>,
			active_id,
			over_id
		})
	}

	updateArchiveItems(id: string) {
		this.archives.splice(
			this.archives.findIndex((item) => item.id === id),
			1
		)
		this.archive_counts = this.archive_counts - 1
	}

	async restoreArchiveItem(id: string) {
		await restoreArchiveItem(id)

		this.updateArchiveItems(id)
	}

	async removeArchiveItem(id: string) {
		await removeArchiveItem(id)

		this.updateArchiveItems(id)
	}

	watchItems() {
		this.items_watcher = getQueryItems(this.id, this.current_angle_id).$.subscribe((items) => {
			this.items = getDocItemsData(items)
		})
	}

	watch() {
		this.todo_watcher = getQueryTodo(this.id).$.subscribe((todo) => {
			this.todo = todo.toMutableJSON()

			if (this.current_angle_id) return

			this.current_angle_id = todo.angles[0].id
		})

		this.watchItems()
	}

	on() {
		this.timer = setInterval(() => archive(this.id), 9000)
	}

	off() {
		this.todo_watcher?.unsubscribe?.()
		this.items_watcher?.unsubscribe?.()

		this.file.off()

		clearInterval(this.timer)
	}
}
