import dayjs from 'dayjs'
import { cloneDeep, uniq, omit } from 'lodash-es'
import { match } from 'ts-pattern'

import { update as updateTodo } from '@/actions/todo'
import { modify, getArchiveTime } from '@/utils'
import { confirm } from '@/utils/antd'

import type {
	ArgsCreate,
	ArgsQueryArchives,
	ArgsUpdate,
	ArgsUpdateStatus,
	ArgsCheck,
	ArgsUpdateRelations,
	ArgsUpdateTodoData,
	ArgsArchiveByTime
} from './types/services'
import type { ArchiveQueryParams } from './types/model'
import type { MangoQuerySelector, MangoQueryOperators } from 'rxdb/dist/types/types'

import type { Todo, RxDB } from '@/types'

export const getQueryTodo = (file_id: string) => {
	return $db.todo.findOne({ selector: { id: file_id } })
}

export const getQueryItems = (file_id: string, angle_id: string) => {
	return $db.collections.todo_items
		.find({ selector: { file_id, angle_id: angle_id } })
		.sort({ create_at: 'asc' }) as RxDB.ItemsQuery<Todo.TodoItem>
}

export const create = async (args: ArgsCreate) => {
	const { file_id, angle_id, item } = args

	const [{ sort }] = await $db.collections.todo_items.find().sort({ sort: 'desc' }).limit(1).exec()

	await $db.collections.todo_items.incrementalUpsert({
		...item,
		file_id,
		angle_id,
		sort: sort + 1
	})

	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

export const queryTodo = (file_id: string) => {
	return getQueryTodo(file_id).exec()
}

export const queryItems = (file_id: string, angle_id: string) => {
	return getQueryItems(file_id, angle_id).exec()
}

export const queryArchives = (args: ArgsQueryArchives, query_params: ArchiveQueryParams) => {
	const { file_id, page } = args
	const { angle_id, tags, begin_date, end_date, status } = query_params
	const selector: MangoQuerySelector<Todo.Todo> = {}

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

	return $db.collections.todo_archives
		.find({
			selector: {
				file_id,
				...selector
			}
		})
		.skip(page * 48)
		.limit(48)
		.sort({ create_at: 'desc' })
		.exec()
}

export const queryArchivesCounts = (file_id: string) => {
	return $db.collections.todo_archives.count({ selector: { file_id } }).exec()
}

export const updateTodoData = async (args: ArgsUpdateTodoData) => {
	const { file_id, todo, changed_values, values, setTodo } = args

	if (changed_values.name || changed_values.icon_info) {
		await $app.Event.emit('todo/dirtree/updateItem', {
			id: file_id,
			...(changed_values.icon_info ?? changed_values)
		})
	} else {
		const target = { ...todo, ...omit(values, 'icon_info') } as Todo.Data

		setTodo(target)

		await updateTodo(file_id, omit(target, 'id'))
	}
}

export const update = async (args: ArgsUpdate) => {
	const res = await $db.collections.todo_items.findOne({ selector: { id: args.id } }).exec()

	await res.incrementalModify(modify(args))
}

export const updateStatus = async (args: ArgsUpdateStatus) => {
	const { id, status, auto_archiving } = args

	await update({
		id,
		status,
		archive_time: status === 'checked' || status === 'closed' ? getArchiveTime(auto_archiving) : undefined
	})
}

export const check = async (args: ArgsCheck) => {
	const { file_id, todo, id, status } = args
	const { auto_archiving } = todo

	const exsit_index = todo?.relations?.findIndex((item) => item.items.includes(id))

	await updateStatus({ id, status, auto_archiving })

	if (todo?.relations?.length && exsit_index !== -1) {
		const relation_ids = cloneDeep(todo.relations[exsit_index]).items
		const target_index = relation_ids.findIndex((item) => item === id)

		relation_ids.splice(target_index, 1)

		await Promise.all(
			relation_ids.map((item) => {
				return updateStatus({
					id: item,
					status: status === 'checked' ? 'closed' : 'unchecked',
					auto_archiving
				})
			})
		)

		const relations = cloneDeep(todo.relations)

		relations[exsit_index].checked = status === 'checked'

		await updateTodo(file_id, { relations })
	}
}

export const updateRelations = async (args: ArgsUpdateRelations) => {
	const { file_id, todo, items, active_id, over_id } = args

	if (active_id === over_id) return

	const active_item = items.find((item) => item.id === active_id) as Todo.Todo
	const over_item = items.find((item) => item.id === over_id) as Todo.Todo

	if (active_item.status !== 'unchecked' || over_item.status !== 'unchecked') return

	if (!todo.relations) {
		await updateTodo(file_id, { relations: [{ items: [active_id, over_id], checked: false }] })
	} else {
		const relations = cloneDeep(todo.relations)
		const exsit_active_index = relations.findIndex((item) => item.items.includes(active_id))
		const exsit_over_index = relations.findIndex((item) => item.items.includes(over_id))

		if (exsit_active_index === -1 && exsit_over_index === -1) {
			return await updateTodo(file_id, {
				relations: [...relations, { items: [active_id, over_id], checked: false }]
			})
		}

		if (exsit_active_index === exsit_over_index) {
			if (relations[exsit_active_index].items.length === 2) {
				relations.splice(exsit_active_index, 1)

				return await updateTodo(file_id, { relations })
			} else {
				const over_index = relations[exsit_active_index].items.findIndex((item) => item === over_id)

				relations[exsit_active_index].items.splice(over_index, 1)

				return await updateTodo(file_id, { relations })
			}
		}

		if (exsit_active_index !== -1 && exsit_over_index === -1) {
			relations[exsit_active_index].items.push(over_id)

			return await updateTodo(file_id, { relations })
		}

		if (exsit_over_index !== -1 && exsit_active_index === -1) {
			relations[exsit_over_index].items.push(active_id)

			return await updateTodo(file_id, { relations })
		}

		if (exsit_active_index !== -1 && exsit_over_index !== -1) {
			const target = uniq(relations[exsit_over_index].items.concat(relations[exsit_over_index].items))

			relations[exsit_over_index].items = target

			relations.splice(exsit_over_index, 1)

			return await updateTodo(file_id, { relations })
		}
	}
}

export const restoreArchiveItem = async (id: string) => {
	const doc = await $db.collections.todo_archives.findOne({ selector: { id } }).exec()

	const data = cloneDeep(doc.toMutableJSON())

	await doc.incrementalRemove()

	await $db.collections.todo_items.incrementalUpsert({
		...data,
		status: 'unchecked',
		create_at: new Date().valueOf()
	})
}

export const removeArchiveItem = async (id: string) => {
	const doc = await $db.collections.todo_archives.findOne({ selector: { id } }).exec()

	await doc.incrementalRemove()
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

	const res = await confirm({
		title: $t('translation:common.notice'),
		// @ts-ignore
		content: $t('translation:todo.Archive.confirm', { date: target_time.format('YYYY-DD-MM') })
	})

	if (!res) return

	await $db.collections.todo_archives
		.find({
			selector: {
				file_id,
				create_at: {
					// $lte: target_time.valueOf()
					$lte: now.subtract(3, 'second').valueOf()
				}
			}
		})
		.remove()
}
