import { CheckSquare, ClipboardText, Square } from 'phosphor-react'
import { Else, If, Then } from 'react-if'

import styles from './index.css'

import type { IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const { type } = props

	if (type === 'group') {
		return (
			<div className={$cx('flex flex_column', styles.group_wrap)}>
				<span className='group_title'>{props.title}</span>
				<div className='group_items flex flex_column'>
					{props.children.map((item) => (
						<Index {...item} key={item.id}></Index>
					))}
				</div>
			</div>
		)
	}

	return (
		<div
			className={$cx(
				'w_100 border_box flex align_start cursor_point transition_normal',
				styles.todo_item,
				styles[props.status]
			)}
		>
			<div className='action_wrap flex justify_center align_center clickable'>
				<If condition={props.status === 'unchecked'}>
					<Then>
						<Square size={16} />
					</Then>
					<Else>
						<CheckSquare size={16} />
					</Else>
				</If>
			</div>
			<span className='text'>{props.text}</span>
			<div className='detail_icon_wrap flex justify_center align_center clickable'>
				<ClipboardText size={18} weight='bold' />
			</div>
		</div>
	)
}

export default $app.memo(Index)
