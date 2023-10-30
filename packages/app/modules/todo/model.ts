import { pick } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { archive } from '@/actions/todo'
import { GlobalModel } from '@/context/app'
import { Utils, File, Loadmore } from '@/models'
import { getDocItemsData } from '@/utils'
import { confirm } from '@/utils/antd'
import { loading } from '@/utils/decorators'
import { arrayMove } from '@dnd-kit/sortable'
import { useInstanceWatch } from '@openages/stk'

import { getTodo } from './initials'
import {
	getQueryTodo,
	getQueryItems,
	create,
	queryTodo,
	queryItems,
	queryArchives,
	queryArchivesCounts,
	updateTodoData,
	check,
	update,
	updateRelations,
	updateTodosSort,
	removeTodoItem,
	restoreArchiveItem,
	removeArchiveItem,
	archiveByTime,
	getAngleTodoCounts,
	removeAngle,
	getTagTodoCounts
} from './services'

import type { ArgsUpdateTodoData, ArgsArchiveByTime } from './types/services'
import type { ItemsSortParams, ArchiveQueryParams, ArgsUpdate, ArgsTab } from './types/model'
import type { RxDB, Todo, TodoArchive } from '@/types'
import type { Subscription } from 'rxjs'
import type { Watch } from '@openages/stk'

@injectable()
export default class Index {
	id = ''
	timer: NodeJS.Timeout = null
	todo = {} as Todo.Data
	todo_watcher = null as Subscription
	items = [] as Array<Todo.TodoItem>
	items_watcher = null as Subscription
	archives = [] as Array<TodoArchive.Item>
	archive_counts = 0
	current_angle_id = ''
	visible_settings_modal = false
	visible_archive_modal = false
	items_sort_param = null as ItemsSortParams
	items_filter_tags = [] as Array<string>
	archive_query_params = {} as ArchiveQueryParams

	watch = {
		['current_angle_id|items_sort_param|items_filter_tags']: () => {
			if (!this.id) return

			this.queryItems()
		},
		['todo.angles']: (v) => {
			if (!this.id) return
			if (!this.todo.id) return

			const exist = v.find((item) => item.id === this.current_angle_id)

			if (!exist) {
				this.current_angle_id = v[0].id
			}
		},
		['visible_archive_modal']: (v) => {
			if (v) {
				this.queryArchives()
				this.queryArchivesCounts()
			} else {
				this.loadmore.page = 0
				this.loadmore.end = false
				this.archive_query_params = {}
			}
		},
		['loadmore.page']: (v) => {
			if (!v) return

			this.queryArchives()
		},
		['archive_query_params']: () => {
			if (!this.visible_archive_modal) return

			this.loadmore.page = 0
			this.loadmore.end = false

			this.queryArchives(true)
		}
	} as Watch<
		Index & {
			'current_angle_id|items_sort_param|items_filter_tags': any
			'todo.angles': Todo.Data['angles']
			'loadmore.page': number
		}
	>

	get is_filtered() {
		return Boolean(this.items_sort_param) || this.items_filter_tags.length > 0
	}

	constructor(
		public global: GlobalModel,
		public utils: Utils,
		public file: File,
		public loadmore: Loadmore
	) {
		makeAutoObservable(this, { watch: false }, { autoBind: true, deep: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.utils.acts = [...useInstanceWatch(this)]
		this.id = id

		this.on()
		this.watchTodo()

		this.file.init(this.id)

		this.queryTodo()
		this.queryItems()
	}

	@loading
	async create(item: Todo.TodoItem, quick?: boolean) {
		return await create(
			{
				file_id: this.id,
				angle_id: this.current_angle_id,
				item
			},
			quick
		)
	}

	@loading
	async queryTodo() {
		const todo = await queryTodo(this.id)

		this.todo = todo.toMutableJSON()
	}

	@loading
	async queryItems() {
		await archive(this.id)

		const items = await queryItems({
			file_id: this.id,
			angle_id: this.current_angle_id,
			items_sort_param: this.items_sort_param,
			items_filter_tags: this.items_filter_tags
		})

		this.items = getDocItemsData(items)

		if (this.items_watcher) {
			this.items_watcher.unsubscribe()

			this.watchItems()
		}
	}

	async queryArchives(reset?: boolean) {
		const items = (await queryArchives(
			{ file_id: this.id, page: this.loadmore.page },
			this.archive_query_params
		)) as RxDB.ItemsDoc<TodoArchive.Item>

		if (items.length === 0) {
			this.loadmore.end = true

			if (!reset) return
		}

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
	}

	async update(args: ArgsUpdate) {
		const { type, index, value } = args
		const item = this.items[index]

		if (type == 'parent') {
			await update({ id: item.id, ...value })
		} else {
			await update({ id: item.id, children: value })
		}
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

	async move(args: { active_index: number; over_index: number }) {
		this.items = arrayMove(toJS(this.items), args.active_index, args.over_index)

		this.stopWatchItems()

		await updateTodosSort(this.items)

		this.watchItems()
	}

	async removeAngle(angle_id: string) {
		const counts = await getAngleTodoCounts(this.id, angle_id)

		const res = await confirm({
			title: $t('translation:common.notice'),
			// @ts-ignore
			content: $t('translation:todo.SettingsModal.angles.remove_confirm', { counts })
		})

		if (!res) return false

		await removeAngle(this.id, angle_id)

		return true
	}

	async removeTag(tag_id: string) {
		const counts = await getTagTodoCounts(this.id, tag_id)

		if (counts > 0) {
			$modal.warning({
				title: $t('translation:common.notice'),
				// @ts-ignore
				content: $t('translation:todo.SettingsModal.tags.remove_confirm', { counts }),
				centered: true
			})

			return false
		}

		return true
	}

	async insert(args: { index: number; data?: Todo.Todo; callback?: () => Promise<void> }) {
		if (this.is_filtered) return

		const { index, data, callback } = args
		const todo = data ?? (getTodo() as Todo.TodoItem)
		const items = toJS(this.items)

		this.stopWatchItems()

		const item = await this.create(todo, true)

		items.splice(index + 1, 0, item as Todo.TodoItem)

		await updateTodosSort(items)

		if (callback) await callback()

		this.watchItems()

		if (!data) setTimeout(() => document.getElementById(`todo_${item.id}`)?.focus(), 0)
	}

	async tab(args: ArgsTab) {
		if (this.is_filtered) return

		const { type, index } = args
		const item = this.items[index] as Todo.Todo

		if (type === 'in') {
			const prev_item = this.items[index - 1]
			const exsit_index = this.todo.relations
				? this.todo.relations.findIndex((relation) => relation.items.includes(item.id))
				: -1

			if (!prev_item || prev_item.type === 'group') return
			if (exsit_index !== -1) return

			this.stopWatchItems()

			await removeTodoItem(item.id)

			const data = { ...pick(item, ['id', 'text']), status: 'unchecked' } as Todo.Todo['children'][number]

			const children = prev_item.children ? [...prev_item.children, data] : [data]

			await update({ id: prev_item.id, children })

			this.watchItems()
		} else {
			const children_index = args.children_index
			const data = item.children[children_index]
			const children = toJS(item.children)

			children.splice(children_index, 1)

			await this.insert({
				index,
				data: {
					...getTodo(),
					text: data.text,
					status: 'unchecked'
				} as Todo.Todo,
				callback: async () => {
					await update({ id: item.id, children })
				}
			})
		}
	}

	async remove(id: string) {
		await removeTodoItem(id)
	}

	async restoreArchiveItem(id: string) {
		await restoreArchiveItem(id)

		this.updateArchiveItems(id)
	}

	async removeArchiveItem(id: string) {
		await removeArchiveItem(id)

		this.updateArchiveItems(id)
	}

	async archiveByTime(v: ArgsArchiveByTime) {
		await archiveByTime(this.id, v)

		this.loadmore.page = 0
		this.loadmore.end = false

		await this.queryArchives(true)
	}

	updateArchiveItems(id: string) {
		this.archives.splice(
			this.archives.findIndex((item) => item.id === id),
			1
		)
		this.archive_counts = this.archive_counts - 1
	}

	stopWatchItems() {
		if (this.items_watcher) this.items_watcher.unsubscribe()
	}

	watchItems() {
		this.items_watcher = getQueryItems({
			file_id: this.id,
			angle_id: this.current_angle_id,
			items_sort_param: this.items_sort_param,
			items_filter_tags: this.items_filter_tags
		}).$.subscribe((items) => {
			this.items = getDocItemsData(items)
		})
	}

	watchTodo() {
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
		this.utils.off()
		this.file.off()

		this.todo_watcher?.unsubscribe?.()
		this.items_watcher?.unsubscribe?.()

		clearInterval(this.timer)
	}
}
