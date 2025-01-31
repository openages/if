import type { Todos } from '../model'
import type { CSSProperties } from 'react'

export default (todos: Todos, limit: number) => {
	let border: string = ''

	const relative_date = typeof todos === 'string' ? todos : todos.relative_date
	const target = {} as CSSProperties

	if (relative_date) {
		switch (relative_date) {
			case 'pass':
				border = 'var(--color_border_light)'
				break
			case 'now':
				border = 'rgba(var(--color_text_rgb),0.24)'
				break
		}

		if (border) target['border'] = `9px solid ${border}`
	}

	if (typeof todos === 'object' && todos.todos && todos.todos.length) {
		target['backgroundColor'] =
			`rgba(var(--${relative_date === 'now' ? 'color_blue_rgb' : 'color_success_rgb'}),${parseFloat((todos.todos.length / limit).toFixed(2)) + 0.2})`
	}

	return target
}
