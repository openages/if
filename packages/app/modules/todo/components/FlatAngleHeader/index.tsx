import { Progress } from 'antd'

import { CheckCircle, Plus } from '@phosphor-icons/react'

import styles from './index.css'

import type { Todo } from '@/types'

import type { IPropsFlatTodoItem } from '../../types'

interface IProps {
	angle: Todo.Angle
	dimension_id: string
	counts: number
	percent: number
	sticky?: boolean
	insert: IPropsFlatTodoItem['insert']
}

const Index = (props: IProps) => {
	const { angle, dimension_id, counts, percent, sticky, insert } = props

	return (
		<div className={$cx('w_100 border_box', styles._local, sticky && styles.sticky)}>
			<div className='kanban_item_header w_100 border_box flex justify_between align_center'>
				<div className='left_wrap flex align_center'>
					<div className='progress_wrap flex align_center'>
						{percent === 100 ? (
							<CheckCircle size={18}></CheckCircle>
						) : (
							<Progress
								className='progress'
								type='circle'
								size={15}
								showInfo={false}
								strokeColor='rgba(var(--color_text_rgb), 0.66)'
								trailColor='rgba(var(--color_text_rgb), 0.24)'
								strokeWidth={12}
								steps={{ count: counts, gap: 8 }}
								percent={percent}
							></Progress>
						)}
					</div>
					<span className='name'>{angle.text}</span>
					{counts > 0 && <span className='count ml_6'>{counts}</span>}
				</div>
				<div
					className='btn_insert border_box flex justify_center align_center clickable'
					onClick={() => insert({ index: -1, dimension_id })}
				>
					<Plus weight='bold'></Plus>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
