import { Else, If, Then } from 'react-if'

import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const { type, text } = props

	if (type === 'title') {
		return (
			<div className={$cx('flex flex_column', styles.group_wrap)}>
				<span className='group_title'>{text}</span>
			</div>
		)
	}

	return (
		<div
			className={$cx(
				'w_100 border_box flex align_start transition_normal',
				styles.todo_item,
				styles[props.status]
			)}
		>
			<div className='action_wrap flex justify_center align_center cursor_point clickable'>
				<If condition={props.status === 'unchecked'}>
					<Then>
						<Square size={16} />
					</Then>
					<Else>
						<CheckSquare size={16} />
					</Else>
				</If>
			</div>
			<span className='text'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
