import { useMemoizedFn } from 'ahooks'
import { Switch } from 'antd'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['schedule']>) => {
	const { value, onChange } = props

	const onToggleValue = useMemoizedFn(() => onChange(!value))

	return <Switch size='small' value={value} onChange={onToggleValue}></Switch>
}

export default $app.memo(Index)
