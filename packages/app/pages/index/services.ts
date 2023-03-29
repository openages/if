import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import type { Todo, TodoArchive, RxDB } from '@/types'
import type { RxDocument } from 'rxdb'

const archives_page_size = 12

@injectable()
export default class Index {
	id = ''
	angle = ''
	info = {} as RxDocument<Todo.Data>
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
			() => this.query()
		)

		reaction(
			() => this.angle,
			() => this.queryItems()
		)
	}

	async query() {
		this.info = (await $db.todo.findOne({ selector: { id: this.id } }).exec())! as RxDocument<Todo.Data>
		this.angle = this.info.angle

		this.info.$.subscribe((v) => (this.info = v))
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
		this.items_query.$?.unsubscribe?.()
	}
}
