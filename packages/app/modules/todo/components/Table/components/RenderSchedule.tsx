import { useMemoizedFn } from 'ahooks'
import { Switch } from 'antd'

import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['schedule']>) => {
	const { value, onChange } = props

	const onToggleValue = useMemoizedFn(() => onChange(!value))

	return (
		<div className={$cx('flex justify_center', styles.RenderSchedule)}>
			<Switch size='small' value={value} onChange={onToggleValue}></Switch>
		</div>
	)
}

export default $app.memo(Index)
