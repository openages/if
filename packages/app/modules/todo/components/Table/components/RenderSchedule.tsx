import { useMemoizedFn } from 'ahooks'
import { Switch } from 'antd'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['schedule']>) => {
	const { value, onChange } = props

	const onToggleValue = useMemoizedFn(() => onChange(!value))

	return (
		<div className={$cx('flex justify_center', styles.RenderSchedule)}>
			<Switch size='small' value={value} onChange={onToggleValue}></Switch>
		</div>
	)
}

export default $app.memo(Index)
