import { useDrag, useDrop, useMemoizedFn } from 'ahooks'
import { useState, useRef } from 'react'
import { Switch, Case } from 'react-if'

import { Square, CheckSquare } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const { item, makeLinkLine, check, updateRelations } = props
	const { id, text, status } = item
	const linker = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)

	useDrag(id, linker, {
		onDragStart: () => {
			if (status !== 'unchecked') return

			setDragging(true)
		},
		onDragEnd: () => {
			setDragging(false)
			makeLinkLine(null)
		}
	})

	useDrop(linker, {
		onDom: (active_id: string, { target }) => {
			if (status !== 'unchecked') return

			const over = target as HTMLDivElement
			const over_id = over.getAttribute('data-id')

			if (active_id === over_id) return

			updateRelations(active_id, id)
			setHovering(false)
		},
		onDragEnter: () => {
			if (status !== 'unchecked') return

			setHovering(true)
		},
		onDragLeave: () => setHovering(false)
	})

	const onCheck = useMemoizedFn(() => {
		if (status === 'closed') return

		check({ id, status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const onDrag = useMemoizedFn(({ clientY }) => {
		if (status !== 'unchecked') return

		makeLinkLine({ active_id: id, y: clientY })
	})

	return (
		<div
			className={$cx(
				'w_100 border_box flex align_start transition_normal relative',
				styles.todo_item,
				styles[item.status]
			)}
		>
			<div
				id={id}
				className={$cx(
					'dot_wrap border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10',
					dragging && 'dragging',
					hovering && 'hovering'
				)}
				ref={linker}
				onDrag={onDrag}
			></div>
			<div
				className='action_wrap flex justify_center align_center cursor_point clickable'
				onClick={onCheck}
			>
				<Switch>
					<Case condition={status === 'unchecked' || status === 'closed'}>
						<Square size={16} />
					</Case>
					<Case condition={status === 'checked'}>
						<CheckSquare size={16} />
					</Case>
				</Switch>
			</div>
			<span className='text'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
