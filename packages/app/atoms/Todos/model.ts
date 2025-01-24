import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { check, queryItem, recycle } from '@/modules/todo/services'
import { getDocItem, getDocItemsData, id as GenId } from '@/utils'
import { arrayMove } from '@dnd-kit/sortable'

import { getTodoItems, updateTodoItem } from './services'

import type { Todo } from '@/types'
import type { Subscription } from 'rxjs'
import type { RxDocument } from 'rxdb'
import type { DragEndEvent } from '@dnd-kit/core'
import type { IProps } from './index'

@injectable()
export default class Index {
	ids = [] as Array<string>
	mode = 'view' as IProps['mode']
	items = [] as Array<Todo.Todo>
	active_item = null as unknown as Todo.Todo

	watcher = null as unknown as Subscription

	onChange = null as unknown as (ids: Array<string>) => void

	constructor() {
		makeAutoObservable(this, { ids: false, mode: false, watcher: false, onChange: false }, { autoBind: true })
	}

	init(args: Pick<IProps, 'ids' | 'mode' | 'onChange'>) {
		const { ids, mode, onChange } = args

		this.ids = ids
		this.mode = mode

		this.onChange = onChange!

		this.watchItems()
	}

	remove(index: number) {
		const target = $copy(this.items)

		target.splice(index, 1)

		this.items = target

		this.onChange(target.map(item => item.id))
	}

	onDragEnd({ active, over }: DragEndEvent) {
		this.active_item = null as unknown as Todo.Todo

		if (!over?.id) return
		if (active.id === over.id) return

		const target = arrayMove(
			this.items,
			active.data.current!.index as number,
			over.data.current!.index as number
		)

		this.items = target

		this.onChange(target.map(item => item.id))
	}

	async check(index: number) {
		const { id, file_id } = this.items[index]

		const file = (await $db.dirtree_items.findOne(file_id).exec())!

		await $app.Event.emit('global.app.check', { id, file: getDocItem(file) })
	}

	async updateTodoItem(index: number, id: string, v: Partial<Todo.Todo>) {
		this.items[index] = { ...this.items[index], ...v }

		await updateTodoItem(id, v)
	}

	async changeStatus(index: number, id: string, status: Todo.Todo['status']) {
		const { file_id } = this.items[index]

		this.items[index] = { ...this.items[index], status }

		const settings_string = (await $db.module_setting.findOne(file_id).exec())!
		const file = (await $db.dirtree_items.findOne(file_id).exec())!

		const todo_setting = getDocItem(settings_string)!
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
	}

	checkExsit(keys: Array<string>) {
		this.ids.forEach((item, index) => {
			if (!keys.includes(item)) {
				this.ids[index] = null as unknown as string
			}
		})

		this.ids = this.ids.filter(item => item)

		this.onChange($copy(this.ids))
	}

	watchItems() {
		this.watcher = getTodoItems(this.ids).$.subscribe(doc => {
			if (!this.mode) this.checkExsit(Array.from(doc.keys()))

			this.items = this.ids.map(id => getDocItem(doc.get(id)!)) as Array<Todo.Todo>
		})
	}

	off() {
		this.watcher?.unsubscribe?.()
	}
}
