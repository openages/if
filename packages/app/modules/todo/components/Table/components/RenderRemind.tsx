import Remind from '../../Remind'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['remind_time']>) => {
	const { value, onChange } = props

	return <Remind useByDetail remind_time={value} onChangeRemind={onChange}></Remind>
}

export default $app.memo(Index)
