import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { archive, cycle } from '@/actions/todo'
import { GlobalModel } from '@/context/app'
import { File, Loadmore, Utils } from '@/models'
import { getDocItem, getDocItemsData, id } from '@/utils'
import { confirm } from '@/utils/antd'
import { disableWatcher, loading } from '@/utils/decorators'
import { arrayMove } from '@dnd-kit/sortable'
import { useInstanceWatch } from '@openages/stk'

import { getTodo } from './initials'
import {
	archiveByTime,
	check,
	create,
	getAngleTodoCounts,
	getQueryItems,
	getQueryTodo,
	getTagTodoCounts,
	queryArchives,
	queryArchivesCounts,
	queryItem,
	queryItems,
	queryTodo,
	removeAngle,
	removeTodoItem,
	restoreArchiveItem,
	update,
	updateRelations,
	updateTodoData,
	updateTodosSort
} from './services'

import type { RxDB, Todo } from '@/types'
import type { Watch } from '@openages/stk'
import type { ManipulateType } from 'dayjs'
import type { Subscription } from 'rxjs'
import type { ArchiveQueryParams, ArgsTab, ArgsUpdate, ItemsSortParams, KanbanItems } from './types/model'
import type { ArgsArchiveByTime, ArgsUpdateTodoData } from './types/services'

@injectable()
export default class Index {
	id = ''
	mode = 'list' as 'list' | 'kanban' | 'table'
	kanban_mode = 'angle' as 'angle' | 'tag'
	timer_cycle: NodeJS.Timeout = null
	timer_archive: NodeJS.Timeout = null

	todo = {} as Todo.Data
	todo_watcher = null as Subscription
	items = [] as Array<Todo.TodoItem>
	items_watcher = null as Subscription
	kanban_items = {} as KanbanItems
	kanban_items_watcher = [] as Array<Subscription>

	archives = [] as Array<Todo.Todo>
	archive_counts = 0
	archive_query_params = {} as ArchiveQueryParams

	items_sort_param = null as ItemsSortParams
	items_filter_tags = [] as Array<string>

	visible_settings_modal = false
	visible_archive_modal = false
	visible_detail_modal = false
	visible_help_modal = false

	current_angle_id = ''
	current_detail_index = -1

	watch = {
		['current_angle_id|items_sort_param|items_filter_tags']: () => {
			if (!this.id) return

			this.visible_detail_modal = false
			this.current_detail_index === -1

			this.queryItems()
		},
		['todo.angles']: v => {
			if (!this.id) return
			if (!this.todo.id) return

			const exist = v.find(item => item.id === this.current_angle_id)

			if (!exist) {
				this.current_angle_id = v[0].id
			}
		},
		['visible_archive_modal']: v => {
			if (v) {
				this.queryArchives()
				this.queryArchivesCounts()
			} else {
				this.loadmore.page = 0
				this.loadmore.end = false
				this.archive_query_params = {}
			}
		},
		['loadmore.page']: v => {
			if (!v) return

			this.queryArchives()
		},
		['archive_query_params']: () => {
			if (!this.visible_archive_modal) return

			this.loadmore.page = 0
			this.loadmore.end = false

			this.queryArchives(true)
		},
		['mode']: v => {
			if (v === 'list') {
				this.kanban_items = {}

				this.stopWatchKanbanItems()
				this.watchItems()
			}

			if (v === 'kanban') {
				this.items = []

				this.stopWatchItems()
				this.watchKanbanItems()
			}

			if (v === 'table') {
				this.kanban_items = {}

				this.stopWatchKanbanItems()
				this.watchItems()
			}
		},
		['kanban_mode']: _ => {
			this.kanban_items = {}

			this.stopWatchKanbanItems()
			this.watchKanbanItems()
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

	get current_detail_item() {
		if (this.current_detail_index === -1) return {} as Todo.Todo
		if (!this.items.at(this.current_detail_index)) return {} as Todo.Todo

		return this.items[this.current_detail_index] as Todo.Todo
	}

	constructor(public global: GlobalModel, public utils: Utils, public file: File, public loadmore: Loadmore) {
		makeAutoObservable(this, { watch: false, timer_cycle: false, timer_archive: false }, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.utils.acts = [...useInstanceWatch(this)]
		this.id = id

		this.file.init(this.id)

		this.queryTodo()

		this.on()
		this.watchTodo()
		this.watchItems()
	}

	@loading
	async create(item: Todo.TodoItem, quick?: boolean) {
		await this.setActivity('insert')

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

		this.todo = getDocItem(todo)
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
		)) as RxDB.ItemsDoc<Todo.TodoItem>

		if (items.length === 0) {
			this.archives = []
			this.loadmore.end = true

			if (!reset) return
		}

		const data = getDocItemsData(items) as Array<Todo.Todo>

		if (this.loadmore.page === 0) {
			this.archives = data
		} else {
			this.archives = this.archives.concat(data)
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
			setTodo: todo => {
				this.todo = todo
			}
		})
	}

	async check(args: { id: string; status: Todo.Todo['status'] }) {
		await this.setActivity('check')

		await check({
			file_id: this.id,
			todo: this.todo,
			...args
		})

		if (this.todo.auto_archiving === '0m') {
			await archive(this.id)
		}

		const todo_item = await queryItem(args.id)

		if (todo_item.remind_time) {
			await todo_item.updateCRDT({ ifMatch: { $set: { remind_time: undefined } } })
		}

		if (todo_item.cycle_enabled && todo_item.cycle) {
			if (args.status === 'checked') {
				const now = dayjs()
				const scale = todo_item.cycle.scale as ManipulateType

				const recycle_time = now.startOf(scale).add(todo_item.cycle.interval, scale).valueOf()

				await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time } } })
			} else {
				await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time: undefined } } })
			}
		}
	}

	async update(args: ArgsUpdate) {
		const { type, value, index, kanban_index } = args
		let id = ''

		if (kanban_index !== undefined) {
			id = Object.values(this.kanban_items)[kanban_index].items[index].id
		} else {
			id = this.items[index].id
		}

		if (type == 'parent') {
			await update({ id, ...value })
		} else {
			await update({ id, children: value })
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
			id: this.id,
			title: $t('translation:common.notice'),
			// @ts-ignore
			content: $t('translation:todo.SettingsModal.angles.remove_confirm', { counts })
		})

		if (!res) return false

		if (this.mode === 'kanban') this.stopWatchKanbanItems()

		await removeAngle(this.id, angle_id)

		if (this.mode === 'kanban') this.watchKanbanItems()

		return true
	}

	async removeTag(tag_id: string) {
		const counts = await getTagTodoCounts(this.id, tag_id)

		if (counts > 0) {
			$modal.warning({
				title: $t('translation:common.notice'),
				// @ts-ignore
				content: $t('translation:todo.SettingsModal.tags.remove_confirm', { counts }),
				centered: true,
				getContainer: () => document.getElementById(this.id)
			})

			return false
		}

		return true
	}

	@disableWatcher
	async insert(args: { index: number; data?: Todo.Todo; callback?: () => Promise<void> }) {
		if (this.is_filtered) return

		const { index, data, callback } = args
		const todo = data ?? (getTodo() as Todo.TodoItem)
		const items = toJS(this.items)

		const item = await this.create(todo, true)

		items.splice(index + 1, 0, item as Todo.TodoItem)

		await updateTodosSort(items)

		if (callback) await callback()

		if (!data) setTimeout(() => document.getElementById(`todo_${item.id}`)?.focus(), 0)
	}

	async tab(args: ArgsTab) {
		if (this.is_filtered) return

		const { type, index } = args
		const item = this.items[index] as Todo.Todo

		if (type === 'in') {
			const prev_item = this.items[index - 1]
			const exsit_index = this.todo.relations
				? this.todo.relations.findIndex(relation => relation.items.includes(item.id))
				: -1

			if (!prev_item || prev_item.type === 'group') return
			if (exsit_index !== -1) return
			if (item.children?.length) return

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

	async moveTo(todo_id: string, angle_id: string) {
		await update({ id: todo_id, angle_id })
	}

	async remove(id: string) {
		await removeTodoItem(id)
	}

	async restoreArchiveItem(id: string) {
		const todo_item = await queryItem(id)

		if (todo_item.recycle_time) {
			await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time: undefined } } })
		}

		await restoreArchiveItem(id, this.todo.angles, this.current_angle_id)

		this.updateArchiveItems(id)
	}

	async removeArchiveItem(id: string) {
		await removeTodoItem(id)

		this.updateArchiveItems(id)
	}

	async archiveByTime(v: ArgsArchiveByTime) {
		await archiveByTime(this.id, v)

		this.loadmore.page = 0
		this.loadmore.end = false

		await this.queryArchives(true)
	}

	async cycleByTime() {
		if (!this.id) return

		await cycle(this.id)
	}

	async setActivity(action: 'insert' | 'check') {
		return $db.activity_items.insert({
			id: id(),
			module: 'todo',
			file_id: this.id,
			name: this.file.data.name,
			timestamp: new Date().valueOf(),
			action
		})
	}

	setMode(v: Index['mode']) {
		this.mode = v
		this.items_sort_param = null
		this.items_filter_tags = []
	}

	toggleKanbanMode() {
		this.kanban_mode = this.kanban_mode === 'angle' ? 'tag' : 'angle'
	}

	updateArchiveItems(id: string) {
		this.archives.splice(
			this.archives.findIndex(item => item.id === id),
			1
		)
		this.archive_counts = this.archive_counts - 1
	}

	watchTodo() {
		this.todo_watcher = getQueryTodo(this.id).$.subscribe(todo => {
			this.todo = getDocItem(todo)

			if (this.current_angle_id) return

			this.current_angle_id = todo.angles[0].id
		})
	}

	watchItems() {
		const current_angle_id = this.current_angle_id

		this.items_watcher = getQueryItems({
			file_id: this.id,
			angle_id: this.current_angle_id,
			items_sort_param: this.items_sort_param,
			items_filter_tags: this.items_filter_tags
		}).$.subscribe(items => {
			if (!current_angle_id) return

			this.items = getDocItemsData(items)
		})
	}

	watchKanbanItems() {
		if (this.kanban_mode === 'angle') {
			this.kanban_items_watcher = this.todo.angles.map(item => {
				return getQueryItems({
					file_id: this.id,
					selector: { type: 'todo' },
					angle_id: item.id
				}).$.subscribe(items => {
					this.kanban_items[item.id] = {
						dimension: { type: 'angle', value: item },
						items: getDocItemsData(items) as Array<Todo.Todo>
					}
				})
			})
		} else {
			if (!this.todo.tags.length) {
				this.kanban_items = {}
				this.kanban_items_watcher = []
			}

			this.kanban_items_watcher = this.todo.tags.map(item => {
				return getQueryItems({
					file_id: this.id,
					selector: { type: 'todo' },
					items_filter_tags: [item.id]
				}).$.subscribe(items => {
					this.kanban_items[item.id] = {
						dimension: { type: 'tag', value: item },
						items: getDocItemsData(items) as Array<Todo.Todo>
					}
				})
			})
		}
	}

	stopWatchItems() {
		if (this.items_watcher) this.items_watcher.unsubscribe()
	}

	stopWatchKanbanItems() {
		if (!this.kanban_items_watcher.length) return

		this.kanban_items_watcher.forEach(item => item.unsubscribe())

		this.kanban_items_watcher = []
	}

	on() {
		this.timer_cycle = setInterval(this.cycleByTime, 30 * 1000)
		this.timer_archive = setInterval(() => archive(this.id), 60 * 1000)

		window.$app.Event.on('todo/cycleByTime', this.cycleByTime)
	}

	off() {
		this.utils.off()
		this.file.off()

		this.todo_watcher?.unsubscribe?.()
		this.items_watcher?.unsubscribe?.()
		this.kanban_items_watcher.forEach(item => item?.unsubscribe?.())

		clearInterval(this.timer_cycle)
		clearInterval(this.timer_archive)

		window.$app.Event.off('todo/cycleByTime', this.cycleByTime)
	}
}
