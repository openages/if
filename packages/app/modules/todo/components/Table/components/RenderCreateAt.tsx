import { Tooltip } from 'antd'
import dayjs from 'dayjs'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['create_at']>) => {
	const { value } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderCreateAt)}>
			<Tooltip
				title={dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
				getTooltipContainer={() => document.body}
				destroyTooltipOnHide
			>
				{dayjs().to(dayjs(value))}
			</Tooltip>
		</div>
	)
}

export default $app.memo(Index)
