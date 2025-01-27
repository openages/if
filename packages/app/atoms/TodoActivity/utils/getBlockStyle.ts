import type { Todos } from '../model'

export default (todos: Todos, limit: number) => {
	return todos && todos.length
		? {
				backgroundColor: `rgba(var(--color_success_rgb),${parseFloat((todos.length / limit).toFixed(2)) + 0.2})`
			}
		: undefined
}
