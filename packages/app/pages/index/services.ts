import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import type { Todo, TodoArchive, RxDB } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'

const archives_page_size = 12

@injectable()
export default class Index {
	id = ''
	angle = ''
	info = {} as Todo.Data
	info_query = {} as RxQuery<Todo.Data>
	items = [] as RxDB.ItemsDoc<Todo.TodoItem>
	items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
	archives = [] as RxDB.ItemsDoc<TodoArchive.Item>
	archives_page = 0

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		this.reactions()

		if (this.id) this.query()
	}

	reactions() {
		reaction(
			() => this.id,
			() => {
				if (!this.id) return this.resetData()

				this.query()
			}
		)

		reaction(
			() => this.angle,
			() => {
				if (!this.angle) return

				this.queryItems()
			}
		)
	}

	resetData() {
		this.angle = ''
		this.info = {} as RxDocument<Todo.Data>
		this.items = [] as RxDB.ItemsDoc<Todo.TodoItem>
		this.items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
		this.archives = [] as RxDB.ItemsDoc<TodoArchive.Item>
		this.archives_page = 0
	}

	async query() {
		this.info_query = $db.todo.findOne({ selector: { id: this.id } })!

		const res = (await this.info_query.exec()) as RxDocument<Todo.Data>

		if (!res) return (this.id = '')

		this.info = res.toMutableJSON()
		this.angle = this.info.angle

		this.info_query.$.subscribe((v: RxDocument<Todo.Data>) => {
			if (v?.toMutableJSON) {
				this.info = v.toMutableJSON()
			} else {
				this.info = v || ({} as Todo.Data)
			}
		})
	}

	async queryItems() {
		this.items_query = $db.collections[`${this.id}_todo_items`].find({
			selector: { angle: this.angle }
		}) as RxDB.ItemsQuery<Todo.TodoItem>

		this.items = (await this.items_query.exec())! as RxDB.ItemsDoc<Todo.TodoItem>

		this.items_query.$.subscribe((v) => (this.items = v))
	}

	async queryArchives() {
		const archives = (await $db.collections[`${this.id}_todo_archive`]
			.find()
			.skip(this.archives_page * archives_page_size)
			.limit(archives_page_size)
			.exec())! as RxDB.ItemsDoc<TodoArchive.Item>

		this.archives = this.archives.concat(archives)
	}

	off() {
		this.info_query.$?.unsubscribe?.()
		this.items_query.$?.unsubscribe?.()
	}
}
