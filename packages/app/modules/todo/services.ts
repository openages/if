import dayjs from 'dayjs'
import { omit, uniq } from 'lodash-es'
import { match } from 'ts-pattern'

import { updateSetting } from '@/actions/global'
import { getArchiveTime, getDocItem, getDocItemsData } from '@/utils'
import { confirm, info } from '@/utils/antd'

import type { MangoQueryOperators, MangoQuerySelector, MangoQuerySortPart, RxDocument } from 'rxdb'
import type { ArchiveQueryParams } from './types/model'
import type {
	ArgsArchiveByTime,
	ArgsCheck,
	ArgsQueryArchives,
	ArgsQueryItems,
	ArgsUpdate,
	ArgsUpdateRelations,
	ArgsUpdateStatus,
	ArgsUpdateTodoData
} from './types/services'

import type { RxDB, Todo } from '@/types'
import type { ManipulateType } from 'dayjs'

export const getMaxMinSort = async (angle_id: string, min?: boolean) => {
	const [max_sort_item] = await $db.todo_items
		.find({ selector: { angle_id, archive: false } })
		.sort({ sort: min ? 'asc' : 'desc' })
		.limit(1)
		.exec()

	if (max_sort_item) return max_sort_item.sort

	return 0
}

export const getTotalCounts = async (selector: MangoQuerySelector<Todo.TodoItem>) => {
	return $db.todo_items.count({ selector: { ...selector, type: 'todo' } }).exec()
}

export const getQueryItems = (args: ArgsQueryItems) => {
	const {
		file_id,
		angle_id,
		items_sort_param,
		items_filter_tags,
		selector: _selector,
		sort: _sort,
		table_mode,
		table_page,
		table_pagesize
	} = args

	const selector: MangoQuerySelector<Todo.TodoItem> = { file_id, ..._selector }
	const sort: MangoQuerySortPart<Todo.Todo> = { ..._sort }

	if (!table_mode) {
		selector['$or'] = [
			{ archive: { $exists: false } },
			{ archive: { $eq: undefined } },
			{ archive: { $eq: false } }
		]

		if (angle_id) selector['angle_id'] = angle_id
		if (items_filter_tags?.length || items_sort_param) selector['type'] = 'todo'

		sort['sort'] = 'asc'
		sort['create_at'] = 'asc'

		if (items_filter_tags?.length) {
			selector['tag_ids'] = {
				$elemMatch: {
					$in: items_filter_tags
				}
			} as MangoQueryOperators<Array<string>>
		}

		if (items_sort_param) {
			if (sort['sort']) delete sort['sort']
			if (sort['create_at']) delete sort['create_at']

			if (items_sort_param.type === 'importance') sort['level'] = items_sort_param.order
			if (items_sort_param.type === 'alphabetical') sort['text'] = items_sort_param.order
			if (items_sort_param.type === 'create_at') sort['create_at'] = items_sort_param.order
		}
	} else {
		selector['type'] = 'todo'

		sort['archive'] = 'asc'

		if (!sort['create_at']) sort['create_at'] = 'desc'
	}

	if (!table_mode) {
		return $db.todo_items.find({ selector }).sort(sort) as RxDB.ItemsQuery<Todo.TodoItem>
	} else {
		return $db.todo_items
			.find({ selector })
			.skip((table_page - 1) * table_pagesize)
			.limit(table_pagesize)
			.sort(sort) as RxDB.ItemsQuery<Todo.TodoItem>
	}
}

export const create = async (item: Todo.TodoItem, options?: { quick?: boolean; top?: boolean }) => {
	const sort = await getMaxMinSort(item.angle_id, options?.top)

	const res = await $db.todo_items.insert({
		...item,
		sort: options?.top ? sort - 0.01 : sort + 1
	})

	if (!options?.quick) {
		const container = document.getElementById(item.file_id)

		container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
	}

	return getDocItem(res)
}

export const queryItem = (id: string) => {
	return $db.todo_items.findOne(id).exec()
}

export const queryArchives = (args: ArgsQueryArchives, query_params: ArchiveQueryParams) => {
	const { file_id, page } = args
	const { angle_id, tags, begin_date, end_date, status } = query_params
	const selector: MangoQuerySelector<Todo.TodoItem> = {}

	if (angle_id) {
		selector['angle_id'] = angle_id
	}

	if (tags?.length) {
		selector['tag_ids'] = {
			$elemMatch: {
				$in: tags
			}
		} as MangoQueryOperators<Array<string>>
	}

	if (begin_date) {
		selector['create_at'] = {
			$gte: begin_date.valueOf()
		}
	}

	if (end_date) {
		if (selector?.['create_at']?.['$gte']) {
			selector['create_at'] = {
				$gte: selector['create_at']['$gte'],
				$lte: end_date.valueOf()
			}
		} else {
			selector['create_at'] = {
				$lte: end_date.valueOf()
			}
		}
	}

	if (status) {
		selector['status'] = status
	}

	return $db.todo_items
		.find({
			selector: {
				file_id,
				archive: true,
				...selector
			}
		})
		.skip(page * 48)
		.limit(48)
		.sort({ create_at: 'desc' })
		.exec()
}

export const queryArchivesCounts = (file_id: string) => {
	return $db.todo_items.count({ selector: { file_id, archive: true } }).exec()
}

export const updateTodoSetting = async (args: ArgsUpdateTodoData) => {
	const { file_id, setting, changed_values, values, setTodo } = args

	if (changed_values.name || changed_values.icon_info) {
		await $app.Event.emit('todo/dirtree/update', {
			id: file_id,
			...(changed_values.icon_info ?? changed_values)
		})
	} else {
		const todo_setting = $copy(setting)

		todo_setting.setting = { ...todo_setting.setting, ...omit(values, 'icon_info') }

		setTodo(todo_setting)

		await updateSetting(file_id, todo_setting.setting)
	}
}

export const update = async (data: ArgsUpdate) => {
	const todo_item = await $db.todo_items.findOne({ selector: { id: data.id } }).exec()

	await todo_item.updateCRDT({
		ifMatch: {
			$set: omit(data, 'id')
		}
	})
}

export const updateStatus = async (args: ArgsUpdateStatus) => {
	const { id, status, auto_archiving } = args

	await update({
		id,
		status,
		create_at: new Date().valueOf(),
		archive_time: status === 'checked' || status === 'closed' ? getArchiveTime(auto_archiving) : undefined
	})
}

export const check = async (args: ArgsCheck) => {
	const { file_id, setting, id, status } = args
	const { auto_archiving } = setting

	const exsit_index = setting?.relations?.findIndex(item => item.items.includes(id))

	await updateStatus({ id, status, auto_archiving })

	if (setting?.relations?.length && exsit_index !== -1) {
		const relation_ids = $copy(setting.relations[exsit_index]).items
		const target_index = relation_ids.findIndex(item => item === id)

		relation_ids.splice(target_index, 1)

		await Promise.all(
			relation_ids.map(item => {
				return updateStatus({
					id: item,
					status: status === 'checked' ? 'closed' : 'unchecked',
					auto_archiving
				})
			})
		)

		const relations = $copy(setting.relations)

		relations[exsit_index].checked = status === 'checked'

		await updateSetting(file_id, { relations })
	}
}

export const updateRelations = async (args: ArgsUpdateRelations) => {
	const { file_id, setting, items, active_id, over_id } = args

	if (active_id === over_id) return

	const active_item = items.find(item => item.id === active_id) as Todo.Todo
	const over_item = items.find(item => item.id === over_id) as Todo.Todo

	if (active_item.cycle_enabled || over_item.cycle_enabled) return

	if (active_item.status !== 'unchecked' || over_item.status !== 'unchecked') return

	if (!setting.setting.relations) {
		await updateSetting(file_id, { relations: [{ items: [active_id, over_id], checked: false }] })
	} else {
		const relations = $copy(setting.setting.relations)
		const exsit_active_index = relations.findIndex(item => item.items.includes(active_id))
		const exsit_over_index = relations.findIndex(item => item.items.includes(over_id))

		if (exsit_active_index === -1 && exsit_over_index === -1) {
			return await updateSetting(file_id, {
				relations: [...relations, { items: [active_id, over_id], checked: false }]
			})
		}

		if (exsit_active_index === exsit_over_index) {
			if (relations[exsit_active_index].items.length === 2) {
				relations.splice(exsit_active_index, 1)

				return await updateSetting(file_id, { relations })
			} else {
				const over_index = relations[exsit_active_index].items.findIndex(item => item === over_id)

				relations[exsit_active_index].items.splice(over_index, 1)

				return await updateSetting(file_id, { relations })
			}
		}

		if (exsit_active_index !== -1 && exsit_over_index === -1) {
			relations[exsit_active_index].items.push(over_id)

			return await updateSetting(file_id, { relations })
		}

		if (exsit_over_index !== -1 && exsit_active_index === -1) {
			relations[exsit_over_index].items.push(active_id)

			return await updateSetting(file_id, { relations })
		}

		if (exsit_active_index !== -1 && exsit_over_index !== -1) {
			const target = uniq(relations[exsit_over_index].items.concat(relations[exsit_over_index].items))

			relations[exsit_over_index].items = target

			relations.splice(exsit_over_index, 1)

			return await updateSetting(file_id, { relations })
		}
	}
}

export const removeTodoItem = async (id: string) => {
	await $db.todo_items.findOne({ selector: { id } }).remove()
}

export const cleanTodoItem = async (id: string) => {
	return $db.todo_items.clean(id)
}

export const cleanTodoItems = async (id: string) => {
	const removed_items = await $db.todo_items.getRemovedItems<Todo.Todo>()

	if (!removed_items.length) {
		return info({
			id,
			title: $t('translation:common.notice'),
			content: $t('translation:common.not_found.confirm')
		})
	}

	const res = await confirm({
		id,
		title: $t('translation:common.notice'),
		// @ts-ignore
		content: $t('translation:common.clean.confirm', { counts: removed_items.length })
	})

	if (!res) return

	return $db.todo_items.bulkClean()
}

export const restoreArchiveItem = async (
	id: string,
	angles: Todo.Setting['angles'],
	tags: Todo.Setting['tags'],
	current_angle_id: string
) => {
	const doc = await $db.todo_items.findOne({ selector: { id } }).exec()
	const angle_exsit = angles.find(item => item.id === doc.angle_id)
	const tags_exsit_items = doc.tag_ids.filter(item => tags.find(tag => tag.id === item))
	const sort = await getMaxMinSort(current_angle_id)

	const target = {
		archive: false,
		archive_time: undefined,
		status: 'unchecked',
		sort: sort + 1,
		tag_ids: tags_exsit_items
	} as Todo.Todo

	if (!angle_exsit) target['angle_id'] = current_angle_id

	doc.updateCRDT({
		ifMatch: {
			$set: target
		}
	})
}

export const archiveByTime = async (file_id: string, v: ArgsArchiveByTime) => {
	const now = dayjs()

	const target_time = match(v)
		.with('1year', () => now.subtract(1, 'year'))
		.with('6month', () => now.subtract(6, 'month'))
		.with('3month', () => now.subtract(3, 'month'))
		.with('1month', () => now.subtract(1, 'month'))
		.with('15days', () => now.subtract(15, 'day'))
		.with('1week', () => now.subtract(1, 'week'))
		.exhaustive()

	const query = $db.todo_items.find({
		selector: {
			file_id,
			archive: true,
			create_at: { $lte: now.subtract(3, 'second').valueOf() }
		}
	})

	const remove_items = await query.exec()

	const res = await confirm({
		id: file_id,
		title: $t('translation:common.notice'),
		// @ts-ignore
		content: $t('translation:todo.Archive.confirm', {
			date: target_time.format('YYYY-MM-DD'),
			counts: remove_items.length
		})
	})

	if (!res || !remove_items.length) return

	await query.remove()

	await $db.todo_items.bulkClean(getDocItemsData(remove_items).map(item => item.id))
}

export const getAngleTodoCounts = async (file_id: string, angle_id: string) => {
	return $db.todo_items.count({ selector: { file_id, angle_id } }).exec()
}

export const removeAngle = async (file_id: string, angle_id: string) => {
	return $db.todo_items.find({ selector: { file_id, angle_id, archive: false } }).remove()
}

export const removeTag = async (file_id: string, tag_id: string) => {
	return $db.todo_items
		.find({ selector: { file_id, tag_ids: { $elemMatch: { $in: [tag_id] } }, archive: false } })
		.remove()
}

export const getTagTodoCounts = async (file_id: string, tag_id: string) => {
	return $db.todo_items.count({ selector: { file_id, tag_ids: { $elemMatch: { $in: [tag_id] } } } }).exec()
}

export const recycle = async (todo_item: RxDocument<Todo.Todo>) => {
	if (todo_item.cycle_enabled && todo_item.cycle && todo_item.cycle.value !== undefined) {
		const scale = todo_item.cycle.scale
		const value = todo_item.cycle.value
		const now = dayjs()

		const recycle_time = match(todo_item.cycle.type)
			.with('interval', () => {
				const now = dayjs()

				return scale === 'minute' || scale === 'hour'
					? now.add(value, scale).valueOf()
					: now
							.startOf(scale as ManipulateType)
							.add(value, scale as ManipulateType)
							.valueOf()
			})
			.with('specific', () => {
				if (scale === 'clock') {
					const _now = now.minute(0).second(0)

					return now.hour() < value
						? _now.hour(value).valueOf()
						: _now.add(1, 'day').hour(value).valueOf()
				}

				if (scale === 'weekday') {
					const _now = now.hour(0).minute(0).second(0)

					return now.day() < value
						? _now.day(value).valueOf()
						: _now.add(1, 'week').day(value).valueOf()
				}

				if (scale === 'date') {
					const _now = now.hour(0).minute(0).second(0)

					return now.date() < value
						? _now.date(value).valueOf()
						: _now.add(1, 'month').date(value).valueOf()
				}

				if (scale === 'special') {
					const _now = now.hour(0).minute(0).second(0)
					const target_value = dayjs(value)
					const month = target_value.month()
					const date = target_value.date()

					if (_now.month() < month) {
						return _now.month(month).date(date).valueOf()
					}

					if (_now.month() === month) {
						if (_now.date() < date) {
							return _now.month(month).date(date).valueOf()
						} else {
							return _now.add(1, 'year').month(month).date(date).valueOf()
						}
					}

					return _now.add(1, 'year').month(month).date(date).valueOf()
				}
			})
			.exhaustive()

		await todo_item.updateCRDT({ ifMatch: { $set: { recycle_time } } })
	}
}
