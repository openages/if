import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import type { Todo } from '@/types'

// tabs = ['Now', 'Plan', 'Idea', 'Wait', 'Circle', 'Trashbox']

@injectable()
export default class Index {
	todo_list = {} as Todo.TodoList
	todo_items = [] as Array<Todo.TodoItem>
	angles = [] as Array<string>
	current_angle = ''

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })

		this.reactions()
	}

	reactions() {
		reaction(
			() => this.current_angle,
			(v) => {}
		)
	}
}
