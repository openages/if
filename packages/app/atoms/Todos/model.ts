import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { check, queryItem, recycle } from '@/modules/todo/services'
import { getDocItem, getDocItemsData, id as GenId } from '@/utils'

import { getTodoItems, updateTodoItem } from './services'

import type { Todo } from '@/types'
import type { Subscription } from 'rxjs'
import type { RxDocument } from 'rxdb'

@injectable()
export default class Index {
	items = [] as Array<Todo.Todo>

	watcher = null as Subscription
	disable_watcher = false

	constructor() {
		makeAutoObservable(this, { watcher: false, disable_watcher: false }, { autoBind: true })
	}

	init(ids: Array<string>) {
		this.watchItems(ids)
	}

	watchItems(ids: Array<string>) {
		this.watcher = getTodoItems(ids).$.subscribe(doc => {
			if (this.disable_watcher) return

			this.items = getDocItemsData(Array.from(doc.values())) as Array<Todo.Todo>
		})
	}

	async updateTodoItem(index: number, id: string, v: Partial<Todo.Todo>) {
		this.items[index] = { ...this.items[index], ...v }

		await updateTodoItem(id, v)
	}

	async check(index: number, id: string, status: Todo.Todo['status']) {
		const { file_id } = this.items[index]

		this.items[index] = { ...this.items[index], status }

		const settings_string = await $db.module_setting.findOne(file_id).exec()
		const file = await $db.dirtree_items.findOne(file_id).exec()

		const todo_setting = getDocItem(settings_string)
		const target_setting = JSON.parse(todo_setting.setting)

		await check({
			file_id,
			setting: target_setting,
			id,
			status
		})

		const todo_item = (await queryItem(id)) as RxDocument<Todo.Todo>

		if (todo_item.remind_time) {
			await todo_item.updateCRDT({ ifMatch: { $set: { remind_time: undefined } } })
		}

		if (status === 'checked') {
			recycle(todo_item)
		} else {
			if (todo_item.cycle_enabled && todo_item.cycle && todo_item.cycle.value !== undefined) {
				await todo_item.updateCRDT({ ifMatch: { $unset: { recycle_time: '' } } })
			}
		}

		$db.activity_items.insert({
			id: GenId(),
			module: 'setting',
			file_id,
			name: file.name,
			action: 'check'
		})
	}

	off() {
		this.watcher?.unsubscribe?.()
	}
}
