import type { IPropsFormTableComponent } from '@/components'

import type { Todo } from '@/types'

const Index = (props: IPropsFormTableComponent<Todo.Todo['text']>) => {
	const { value, row_index, deps, extra, onChange } = props

	return <span>{value}</span>
}

export default $app.memo(Index)
