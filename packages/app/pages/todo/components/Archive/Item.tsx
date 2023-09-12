import { If, Then, Else } from 'react-if'

import { CheckSquare, Square } from '@phosphor-icons/react'

import type { Todo } from '@/types'

const Index = (props: Todo.Todo) => {
	const { text, status } = props

	return (
		<div className='archive_item w_100 border_box flex'>
			<div className='action_wrap flex justify_center align_center cursor_point clickable'>
				<If condition={status === 'checked'}>
					<Then>
						<CheckSquare size={16} />
					</Then>
					<Else>
						<Square size={16} />
					</Else>
				</If>
			</div>
			<span className='text'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
