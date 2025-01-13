import { Tooltip } from 'antd'
import dayjs from 'dayjs'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['done_time']>) => {
	const { value, editing, onFocus } = props

	const text = dayjs().to(dayjs(value))
	const date = dayjs(value).format('YYYY-MM-DD HH:mm')

	return (
		<div className={$cx('flex justify_center', styles.RenderCreateAt)}>
			<Choose>
				<When condition={Boolean(value)}>
					{editing ? (
						<Tooltip
							title={text}
							getTooltipContainer={() => document.body}
							destroyTooltipOnHide
							onOpenChange={onFocus}
						>
							{date}
						</Tooltip>
					) : (
						date
					)}
				</When>
				<Otherwise>-</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
