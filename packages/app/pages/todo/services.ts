import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { File } from '@/services'
import { setStorageWhenChange, getDocItemsData } from '@/utils'
import { loading } from '@/utils/decorators'

import type { Todo, TodoArchive, RxDB } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'

const archives_page_size = 12

@injectable()
export default class Index {
	id = ''
	info_query = {} as RxQuery<Todo.Data>
	info = {} as Todo.Data
	items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
	items = [] as Array<Todo.TodoItem>
	archives = [] as RxDB.ItemsDoc<TodoArchive.Item>
	current_angle_id = ''
	archives_page = 0

	constructor(
		public utils: Utils,
		public file: File
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		setStorageWhenChange([{ [`${this.id}_todo_current_angle_id`]: 'current_angle_id' }], this)

		this.reactions()

		if (this.id) {
			this.file.query(this.id)

			this.query()
			this.queryItems()
		}
	}

	reactions() {
		reaction(
			() => this.id,
			(v) => {
				if (!v) return this.resetData()

				this.file.query(v)
				this.query()
			}
		)

		reaction(
			() => this.info,
			() => {
				if (!this.info?.angles?.length) return
				if (this.current_angle_id) return

				this.current_angle_id = this.info.angles[0].id
			}
		)

		reaction(
			() => this.current_angle_id,
			() => {
				if (!this.id) return

				this.queryItems()
			}
		)

		reaction(
			() => this.info.angles,
			(v) => {
				if (!this.id) return
				if (!this.info.id) return

				const exist = v.find((item) => item.id === this.current_angle_id)

				if (!exist) {
					this.current_angle_id = v[0].id
				}
			}
		)
	}

	resetData() {
		this.current_angle_id = ''
		this.info = {} as RxDocument<Todo.Data>
		this.items = [] as RxDB.ItemsDoc<Todo.TodoItem>
		this.items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
		this.archives = [] as RxDB.ItemsDoc<TodoArchive.Item>
		this.archives_page = 0
	}

	@loading
      async add(v: Todo.TodoItem) {
		await $db.collections[`${this.id}_todo_items`].incrementalUpsert(v)
	}

	@loading
	async query() {
		this.info_query = $db.todo.findOne({ selector: { id: this.id } })!

		const res = (await this.info_query.exec()) as RxDocument<Todo.Data>

		if (!res) return (this.id = '')

		this.info = res.toMutableJSON()

		this.info_query.$.subscribe((v: RxDocument<Todo.Data>) => {
			if (v?.toMutableJSON) {
				this.info = v.toMutableJSON()
			} else {
				this.info = v || ({} as Todo.Data)
			}
		})
	}

	@loading
	async queryItems() {
		if (!$db.collections[`${this.id}_todo_items`]) return

		this.items_query = $db.collections[`${this.id}_todo_items`]
			.find({
				selector: { angle_id: this.current_angle_id }
			})
			.sort({ create_at: 'asc' }) as RxDB.ItemsQuery<Todo.TodoItem>

		this.items = getDocItemsData((await this.items_query.exec())! as RxDB.ItemsDoc<Todo.TodoItem>)

		this.items_query.$.subscribe((v) => (this.items = getDocItemsData(v)))
	}

	async queryArchives() {
		const archives = (await $db.collections[`${this.id}_todo_archive`]
			.find()
			.skip(this.archives_page * archives_page_size)
			.limit(archives_page_size)
			.exec())! as RxDB.ItemsDoc<TodoArchive.Item>

		this.archives = this.archives.concat(archives)
	}
}
