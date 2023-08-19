import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { setStorageWhenChange } from '@/utils'
import { loading } from '@/utils/decorators'
import { find } from '@/utils/tree'

import type { Module, DirTree, Todo, TodoArchive, RxDB } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'

const archives_page_size = 12

@injectable()
export default class Index {
	id = ''
	file_query = {} as RxQuery<Module.Item>
	file = {} as DirTree.File
	info_query = {} as RxQuery<Todo.Data>
	info = {} as Todo.Data
	items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
	items = [] as RxDB.ItemsDoc<Todo.TodoItem>
	archives = [] as RxDB.ItemsDoc<TodoArchive.Item>
	current_angle_id = ''
	archives_page = 0

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		setStorageWhenChange([{ [`${this.id}_todo_current_angle_id`]: 'current_angle_id' }], this)

		this.reactions()

		if (this.id) {
			this.queryFile()
			this.query()
		}
	}

	reactions() {
		reaction(
			() => this.id,
			() => {
				if (!this.id) return this.resetData()

				this.queryFile()
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
	async queryFile() {
		this.file_query = $db.module.findOne({ selector: { module: 'todo' } })! as RxQuery<Module.Item>

		const target = (await this.file_query.exec()) as RxDocument<Module.Item>

		this.file = find(target.dirtree, this.id) as DirTree.File

		target.$.subscribe(({ dirtree }) => {
			this.file = find(dirtree, this.id) as DirTree.File
		})
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
		this.items_query = $db.collections[`${this.id}_todo_items`].find({
			selector: { angle_id: this.current_angle_id }
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
}
