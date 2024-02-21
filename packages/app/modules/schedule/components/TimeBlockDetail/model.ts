import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getDocItemsData } from '@/utils'

import type { Todo } from '@/types'

@injectable()
export default class Index {
	search_todos = [] as Array<Todo.Todo>
	compositing = false
	tab = 'todos' as 'todos' | 'set_todos'

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async search(text: string) {
		if (this.compositing) return
		if (!text) return (this.search_todos = [])

		const docs = await $db.todo_items
			.find({
				selector: {
					text: { $regex: `.*${text}.*`, $options: 'i' },
					type: 'todo'
				},
				index: 'file_id'
			})
			.exec()

		this.search_todos = getDocItemsData(docs) as Array<Todo.Todo>
	}
}
