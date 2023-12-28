import Star from '../../Star'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['star']>) => {
	const { value, onChange } = props

	return <Star value={value} onChangeStar={onChange}></Star>
}

export default $app.memo(Index)
