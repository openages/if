import { cloneDeep } from 'lodash-es'
import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import { archive } from '@/actions/todo'
import { Utils } from '@/models'
import { File, LoadMore } from '@/services'
import { setStorageWhenChange, getDocItemsData, modify, getArchiveTime } from '@/utils'
import { loading } from '@/utils/decorators'

import type { Todo, TodoArchive, RxDB } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'
import type { ArgsUpdate, ArgsUpdateStatus } from './types'

const archives_page_size = 48

@injectable()
export default class Index {
	id = ''
	info_query = {} as RxQuery<Todo.Data>
	info = {} as Todo.Data
	items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
	items = [] as Array<Todo.TodoItem>
	archives = [] as Array<TodoArchive.Item>
	archive_counts = 0
	current_angle_id = ''

	constructor(
		public utils: Utils,
		public file: File,
		public loadmore: LoadMore
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(id: string) {
		this.id = id

		setStorageWhenChange([{ [`${this.id}_todo_current_angle_id`]: 'current_angle_id' }], this)

		this.reactions()
		this.initQuery()
	}

	initQuery() {
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
				this.queryItems()
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

		reaction(
			() => this.loadmore.page,
			(v) => {
				if (!v) return

				this.queryArchives()
			}
		)
	}

	resetData() {
		this.current_angle_id = ''
		this.info = {} as RxDocument<Todo.Data>
		this.items = [] as RxDB.ItemsDoc<Todo.TodoItem>
		this.items_query = {} as RxDB.ItemsQuery<Todo.TodoItem>
		this.archives = [] as RxDB.ItemsDoc<TodoArchive.Item>
		this.loadmore.page = 0
		this.loadmore.end = false
	}

	@loading
	async add(v: Omit<Todo.TodoItem, 'file_id' | 'angle_id'>) {
		await $db.collections.todo_items.incrementalUpsert({
			...v,
			file_id: this.id,
			angle_id: this.current_angle_id
		})

		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
	}

	async update(v: ArgsUpdate) {
		const res = await $db.collections.todo_items.findOne({ selector: { id: v.id } }).exec()

		await res.incrementalModify(modify(v))
	}

	async updateStatus(v: ArgsUpdateStatus) {
		await this.update({
			...v,
			archive_time:
				v.status === 'checked' || v.status === 'closed'
					? getArchiveTime(this.info.auto_archiving)
					: undefined
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
		await archive(this.id)

		this.items_query = $db.collections.todo_items
			.find({ selector: { file_id: this.id, angle_id: this.current_angle_id } })
			.sort({ create_at: 'asc' }) as RxDB.ItemsQuery<Todo.TodoItem>

		this.items = getDocItemsData((await this.items_query.exec())! as RxDB.ItemsDoc<Todo.TodoItem>)

		this.items_query.$.subscribe((v) => {
			console.log(123)
			this.items = getDocItemsData(v)
		})
	}

	async queryArchives() {
		const archives = (await $db.collections.todo_archives
			.find({ selector: { file_id: this.id } })
			.skip(this.loadmore.page * archives_page_size)
			.limit(archives_page_size)
			.sort({ create_at: 'desc' })
			.exec())! as RxDB.ItemsDoc<TodoArchive.Item>

		if (archives.length === 0) return (this.loadmore.end = true)

		if (this.loadmore.page === 0) {
			this.archives = getDocItemsData(archives)
		} else {
			this.archives = this.archives.concat(getDocItemsData(archives))
		}
	}

	async queryArchivesCounts() {
		this.archive_counts = await $db.collections.todo_archives.count({ selector: { file_id: this.id } }).exec()
	}

	updateCurrentArchiveItems(id: string) {
		this.archives.splice(
			this.archives.findIndex((item) => item.id === id),
			1
		)
		this.archive_counts = this.archive_counts - 1
	}

	async restoreArchiveItem(id: string) {
		const item = await $db.collections.todo_archives.findOne({ selector: { id } }).exec()

		const data = cloneDeep(item.toMutableJSON())

		await item.incrementalRemove()

		await $db.collections.todo_items.incrementalUpsert({
			...data,
			status: 'unchecked',
			create_at: new Date().valueOf()
		})

		this.updateCurrentArchiveItems(id)
	}

	async removeArchiveItem(id: string) {
		await $db.collections.todo_archives.findOne({ selector: { id } }).remove()

		this.updateCurrentArchiveItems(id)
	}
}
