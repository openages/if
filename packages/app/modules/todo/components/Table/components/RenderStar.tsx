import Star from '../../Level'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['level']>) => {
	const { value, onChange } = props

	return <Star value={value} onChangeStar={onChange}></Star>
}

export default $app.memo(Index)
