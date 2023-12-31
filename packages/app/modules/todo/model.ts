import dayjs from 'dayjs'
import { omit, pick } from 'lodash-es'
import { makeAutoObservable, runInAction } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { archive, cycle } from '@/actions/todo'
import { GlobalModel } from '@/context/app'
import { File, Loadmore, Utils } from '@/models'
import { getDocItem, getDocItemsData, id } from '@/utils'
import { confirm } from '@/utils/antd'
import { disableWatcher, loading } from '@/utils/decorators'
import { arrayMove } from '@dnd-kit/sortable'
import { updateSort } from '@openages/stk/dnd'
import { useInstanceWatch } from '@openages/stk/mobx'

import { getTodo } from './initials'
import {
	archiveByTime,
	check,
	create,
	getAngleTodoCounts,
	getMaxSort,
	getQueryItems,
	getQueryTodoSetting,
	getTagTodoCounts,
	queryArchives,
	queryArchivesCounts,
	queryItem,
	removeAngle,
	removeTodoItem,
	restoreArchiveItem,
	update,
	updateRelations,
	updateTodoSetting
} from './services'

import type { RxDB, Todo } from '@/types'
import type { Watch } from '@openages/stk/mobx'
import type { ManipulateType } from 'dayjs'
import type { MangoQuerySelector } from 'rxdb'
import type { Subscription } from 'rxjs'
import type {
	ArchiveQueryParams,
	ArgsCheck,
	ArgsInsert,
	ArgsMove,
	ArgsRemove,
	ArgsTab,
	ArgsUpdate,
	CurrentDetailIndex,
	CurrentDetailItem,
	Indexes,
	ItemsSortParams,
	KanbanItems,
	KanbanMode,
	Mode
} from './types/model'
import type { ArgsArchiveByTime, ArgsUpdateTodoData } from './types/services'

@injectable()
export default class Index {
	id = ''
	mode = 'list' as Mode
	zen_mode = true
	kanban_mode = '' as KanbanMode
	timer_cycle: NodeJS.Timeout = null
	timer_archive: NodeJS.Timeout = null
	disable_watcher = false

	setting = {} as Todo.TodoSetting
	setting_watcher = null as Subscription
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
	current_detail_index = {} as CurrentDetailIndex

	table_pagesize = 15
	table_selector = {} as MangoQuerySelector<Todo.TodoItem>

	watch = {
		['current_angle_id|items_sort_param|items_filter_tags']: () => {
			if (!this.id) return

			this.visible_detail_modal = false
			this.current_detail_index === ({} as CurrentDetailIndex)

			this.stopWatchItems()
			this.watchItems()

			archive(this.id)
		},
		['setting.setting.angles']: v => {
			if (!this.id) return
			if (!this.setting.file_id) return

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
			this.visible_detail_modal = false

			this.stopWatchItems()

			if (v === 'list' || v === 'table') {
				this.zen_mode = false
				this.kanban_mode = '' as KanbanMode
				this.kanban_items = {}

				this.watchItems()
			}

			if (v === 'kanban') {
				this.zen_mode = true
				this.kanban_mode = 'angle'
				this.items = []
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
			'setting.setting.angles': Todo.Setting['angles']
			'loadmore.page': number
		}
	>

	get is_filtered() {
		return Boolean(this.items_sort_param) || this.items_filter_tags.length > 0
	}

	get current_detail_item() {
		if (!this.current_detail_index.id) return {} as CurrentDetailItem

		const items =
			this.mode === 'kanban' ? this.kanban_items[this.current_detail_index.dimension_id]?.items : this.items

		if (!items) return {} as CurrentDetailItem

		const target_index = items.findIndex(item => item.id === this.current_detail_index.id)

		if (!items[target_index]) return {} as CurrentDetailItem

		return {
			item: $copy(items[target_index]),
			prev_id: target_index - 1 >= 0 ? items.at(target_index - 1)?.id : undefined,
			next_id: items.at(target_index + 1)?.id
		} as CurrentDetailItem
	}

	constructor(
		public global: GlobalModel,
		public utils: Utils,
		public file: File,
		public loadmore: Loadmore
	) {
		makeAutoObservable(
			this,
			{
				timer_cycle: false,
				timer_archive: false,
				disable_watcher: false,
				setting_watcher: false,
				items_watcher: false,
				kanban_items_watcher: false,
				watch: false
			},
			{ autoBind: true }
		)
	}

	init(args: { id: string }) {
		const { id } = args

		this.utils.acts = [...useInstanceWatch(this)]
		this.id = id

		this.file.init(this.id)

		this.on()
		this.watchTodo()
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

	async updateSetting(changed_values: ArgsUpdateTodoData['changed_values'], values: ArgsUpdateTodoData['values']) {
		await updateTodoSetting({
			file_id: this.id,
			setting: this.setting,
			changed_values,
			values,
			setTodo: setting => {
				this.setting = setting
			}
		})
	}

	@loading
	async create(item: Todo.TodoItem, options?: { quick?: boolean; dimension_id?: string }) {
		await this.setActivity('insert')

		const data = {} as Todo.TodoItem

		if (!this.kanban_mode) {
			data['angle_id'] = this.current_angle_id
		}

		if (this.kanban_mode === 'angle') {
			data['angle_id'] = options?.dimension_id
		}

		if (this.kanban_mode === 'tag') {
			data['angle_id'] = this.current_angle_id
			data['tag_ids'] = [options?.dimension_id]
		}

		return create({ ...item, ...data, file_id: this.id } as Todo.TodoItem, options?.quick)
	}

	async check(args: ArgsCheck) {
		const { index, dimension_id, status } = args

		const { item } = this.getItem({ index, dimension_id })

		this.setItem(item, { status })

		await check({
			file_id: this.id,
			setting: this.setting,
			id: item.id,
			status
		})

		if (this.setting.setting.auto_archiving === '0m') {
			await archive(this.id)
		}

		const todo_item = await queryItem(item.id)

		if (todo_item.remind_time) {
			await todo_item.updateCRDT({ ifMatch: { $set: { remind_time: undefined } } })
		}

		if (todo_item.cycle_enabled && todo_item.cycle) {
			if (args.status === 'checked') {
				const now = dayjs()
				const scale = todo_item.cycle.scale as ManipulateType

				const recycle_time =
					scale === 'minute' || scale === 'hour'
						? now.add(todo_item.cycle.interval, scale).valueOf()
						: now.startOf(scale).add(todo_item.cycle.interval, scale).valueOf()

				await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time } } })
			} else {
				await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time: undefined } } })
			}
		}

		await this.setActivity('check')
	}

	async update(args: ArgsUpdate) {
		const { index, dimension_id, type, value } = args

		const { item } = this.getItem({ index, dimension_id })

		const data = type === 'parent' ? { id: item.id, ...value } : { id: item.id, children: value }

		if (type === 'children') {
			if (value?.length > 0) {
				if (!item.open) {
					data['open'] = true
				}
			} else {
				if (item.open) {
					data['open'] = false
				}

				data['children'] = undefined
			}
		}

		this.setItem(item, data)

		await update(data)
	}

	async updateRelations(active_id: string, over_id: string, dimension_id?: string) {
		await updateRelations({
			file_id: this.id,
			setting: this.setting,
			items: this.getItem({ dimension_id }).items as Array<Todo.Todo>,
			active_id,
			over_id
		})
	}

	async move(args: ArgsMove) {
		const { active, over } = args
		const { index: active_index, dimension_id: active_dimension_id } = active
		const { index: over_index, dimension_id: over_dimension_id } = over

		if (!active_dimension_id) {
			const items = arrayMove($copy(this.items), active_index, over_index)

			const { item, sort } = updateSort(items, over_index)

			this.items = items

			await update({ id: item.id, sort })
		} else {
			if (active_dimension_id === over_dimension_id) {
				const items = arrayMove(
					$copy(this.kanban_items[active_dimension_id].items),
					active_index,
					over_index
				)

				const { item, sort } = updateSort(items, over_index)

				this.kanban_items[active_dimension_id].items = items

				await update({ id: item.id, sort })
			} else {
				if (this.isLinked(this.kanban_items[active_dimension_id].items[active_index].id)) return

				const [active_item] = this.kanban_items[active_dimension_id].items.splice(active_index, 1)

				this.kanban_items[over_dimension_id].items.splice(over_index + 1, 0, active_item)

				const { sort } = updateSort(this.kanban_items[over_dimension_id].items, over_index + 1)

				await update({ id: active_item.id, angle_id: over_dimension_id, sort })
			}
		}
	}

	async removeAngle(angle_id: string) {
		const counts = await getAngleTodoCounts(this.id, angle_id)

		if (counts > 0) {
			const res = await confirm({
				id: this.id,
				title: $t('translation:common.notice'),
				// @ts-ignore
				content: $t('translation:todo.SettingsModal.angles.remove_confirm', { counts })
			})

			if (!res) return false
		}

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
				centered: true,
				getContainer: () => document.getElementById(this.id)
			})

			return false
		}

		return true
	}

	@disableWatcher
	async insert(args: ArgsInsert) {
		if (this.is_filtered) return

		const { index, dimension_id, data, callback } = args
		const setting = data ?? (getTodo() as Todo.TodoItem)

		const item = await this.create(setting, { quick: true, dimension_id })

		const { items } = this.getItem({ index, dimension_id })

		runInAction(() => {
			items.splice(index + 1, 0, item as Todo.TodoItem)

			if (callback) callback()
		})

		if (!data) setTimeout(() => document.getElementById(`todo_${item.id}`)?.focus(), 0)

		if (index !== -1) {
			const { sort } = updateSort(items, index + 1)

			await update({ id: item.id, sort })
		}
	}

	@disableWatcher
	async tab(args: ArgsTab) {
		if (this.is_filtered) return
		if (this.kanban_mode === 'tag') return

		const { type, index, dimension_id } = args
		const { items, item } = this.getItem({ index, dimension_id })

		if (type === 'in') {
			const prev_item = items[index - 1]
			const exsit_index = this.setting.setting.relations
				? this.setting.setting.relations.findIndex(relation => relation.items.includes(item.id))
				: -1

			if (!prev_item || prev_item.type === 'group') return
			if (exsit_index !== -1) return
			if (item.children?.length) return

			const data = { ...pick(item, ['id', 'text']), status: 'unchecked' } as Todo.Todo['children'][number]

			const children = prev_item.children ? [...prev_item.children, data] : [data]

			await this.remove({
				index,
				dimension_id,
				id: item.id,
				callback() {
					prev_item.children = children
					prev_item.open = true
				}
			})

			await update({ id: prev_item.id, children: $copy(children), open: true })
		} else {
			const children_index = args.children_index
			const data = item.children[children_index]
			const target_item = {
				...getTodo(),
				text: data.text,
				angle_id: item.angle_id,
				status: 'unchecked'
			} as Todo.Todo

			await this.insert({
				index,
				dimension_id,
				data: target_item,
				callback() {
					item.children.splice(children_index, 1)

					if (!item.children.length) {
						item.open = false
						item.children = undefined
					}
				}
			})

			await update({ id: item.id, children: $copy(item.children) })
		}
	}

	async moveTo(todo_id: string, angle_id: string) {
		if (this.isLinked(todo_id)) return

		const sort = await getMaxSort(angle_id)

		await update({ id: todo_id, angle_id, sort: sort + 1 })
	}

	async remove(args: ArgsRemove) {
		const { index, dimension_id, id, callback } = args

		const { items } = this.getItem({ index, dimension_id })

		runInAction(() => {
			items.splice(index, 1)

			if (callback) callback()
		})

		await removeTodoItem(id)
	}

	async restoreArchiveItem(id: string) {
		const todo_item = await queryItem(id)

		if (todo_item.recycle_time) {
			await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time: undefined } } })
		}

		await restoreArchiveItem(id, this.setting.setting.angles, this.current_angle_id)

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
			module: 'setting',
			file_id: this.id,
			name: this.file.data.name,
			timestamp: new Date().valueOf(),
			action
		})
	}

	onTableRowChange(index: number, values: Partial<Todo.Todo>) {
		const { item } = this.getItem({ index })

		const key = Object.keys(values)[0] as keyof Partial<Todo.Todo>
		const value = values[key]

		if (key === 'status') {
			return this.check({ index, status: value as Todo.Todo['status'] })
		}

		if (key === 'cycle') {
			return this.update({ type: 'parent', index, value: { ...(value as Partial<Todo.Todo>) } })
		}

		if (key === 'archive') {
			return this.restoreArchiveItem(item.id)
		}

		this.update({ type: 'parent', index, value: values })
	}

	isLinked(id: string) {
		return this.setting.setting?.relations?.findIndex(item => item.items.includes(id)) !== -1
	}

	getItem(args: Indexes) {
		const { index, dimension_id } = args
		const kanban_mode = dimension_id !== undefined

		const items = match(kanban_mode)
			.with(true, () => this.kanban_items[dimension_id].items)
			.otherwise(() => this.items)

		return { items, item: index === undefined ? null : (items[index] as Todo.Todo) }
	}

	setItem(item: any, data: any) {
		Object.keys(omit(data, 'id')).forEach(key => {
			item[key] = data[key]
		})
	}

	setMode(v: Index['mode']) {
		this.mode = v
		this.items_sort_param = null
		this.items_filter_tags = []
	}

	updateArchiveItems(id: string) {
		this.archives.splice(
			this.archives.findIndex(item => item.id === id),
			1
		)
		this.archive_counts = this.archive_counts - 1
	}

	watchTodo() {
		this.setting_watcher = getQueryTodoSetting(this.id).$.subscribe(setting => {
			const todo_setting = getDocItem(setting)

			this.setting = { ...omit(todo_setting, 'setting'), setting: JSON.parse(todo_setting.setting) }

			if (this.current_angle_id) return

			this.current_angle_id = this.setting.setting.angles[0].id
		})
	}

	watchItems() {
		if (this.mode === 'list') {
			const current_angle_id = this.current_angle_id

			this.items_watcher = getQueryItems({
				file_id: this.id,
				angle_id: this.current_angle_id,
				items_sort_param: this.items_sort_param,
				items_filter_tags: this.items_filter_tags
			}).$.subscribe(items => {
				if (this.disable_watcher) return
				if (!current_angle_id) return

				this.items = getDocItemsData(items)
			})
		}

		if (this.mode === 'table') {
			this.items_watcher = getQueryItems({
				file_id: this.id,
				items_sort_param: this.items_sort_param,
				items_filter_tags: this.items_filter_tags,
				selector: this.table_selector,
				table_mode: true
			}).$.subscribe(items => {
				this.items = getDocItemsData(items)
			})
		}
	}

	watchKanbanItems() {
		if (this.kanban_mode === 'angle') {
			this.kanban_items_watcher = this.setting.setting.angles.map(item => {
				return getQueryItems({
					file_id: this.id,
					selector: { type: 'todo' },
					angle_id: item.id
				}).$.subscribe(items => {
					if (this.disable_watcher) return

					this.kanban_items[item.id] = {
						dimension: { type: 'angle', value: item },
						items: getDocItemsData(items) as Array<Todo.Todo>
					}
				})
			})
		} else {
			if (!this.setting.setting.tags.length) {
				this.kanban_items = {}
				this.kanban_items_watcher = []
			}

			this.kanban_items_watcher = this.setting.setting.tags.map(item => {
				return getQueryItems({
					file_id: this.id,
					selector: { type: 'todo' },
					items_filter_tags: [item.id]
				}).$.subscribe(items => {
					if (this.disable_watcher) return

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

		this.setting_watcher?.unsubscribe?.()
		this.items_watcher?.unsubscribe?.()
		this.kanban_items_watcher.forEach(item => item?.unsubscribe?.())

		clearInterval(this.timer_cycle)
		clearInterval(this.timer_archive)

		window.$app.Event.off('todo/cycleByTime', this.cycleByTime)
	}
}
