import { cloneDeep, uniq, omit } from 'lodash-es'

import { update as updateTodo } from '@/actions/todo'
import { modify, getArchiveTime } from '@/utils'

import type {
	ArgsCreate,
	ArgsQueryArchives,
	ArgsUpdate,
	ArgsUpdateStatus,
	ArgsCheck,
	ArgsUpdateRelations,
	ArgsUpdateTodoData
} from './types/services'
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

	await $db.collections.todo_items.incrementalUpsert({
		...item,
		file_id,
		angle_id
	})

	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

export const queryTodo = (file_id: string) => {
	return getQueryTodo(file_id).exec()
}

export const queryItems = (file_id: string, angle_id: string) => {
	return getQueryItems(file_id, angle_id).exec()
}

export const queryArchives = (args: ArgsQueryArchives) => {
	const { file_id, page } = args

	return $db.collections.todo_archives
		.find({ selector: { file_id } })
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
