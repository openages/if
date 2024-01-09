import { Tooltip } from 'antd'
import dayjs from 'dayjs'

import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['create_at']>) => {
	const { value } = props

	return (
		<div className={$cx('flex justify_end', styles.RenderCreateAt)}>
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
