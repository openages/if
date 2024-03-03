import { Tooltip } from 'antd'
import dayjs from 'dayjs'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['create_at']>) => {
	const { value, editing, onFocus } = props

	const text = dayjs().to(dayjs(value))

	return (
		<div className={$cx('flex justify_center', styles.RenderCreateAt)}>
			{editing ? (
				<Tooltip
					title={dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
					getTooltipContainer={() => document.body}
					destroyTooltipOnHide
					onOpenChange={onFocus}
				>
					{text}
				</Tooltip>
			) : (
				text
			)}
		</div>
	)
}

export default $app.memo(Index)
