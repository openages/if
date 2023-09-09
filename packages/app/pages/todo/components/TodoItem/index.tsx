import { useDrag, useDrop } from 'ahooks'
import { useState, useRef, useEffect } from 'react'
import { Else, If, Then } from 'react-if'

import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const { item, addIfIds } = props
	const { id, type, text } = item
	const linker = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)

	useDrag(id, linker, {
		onDragStart: () => setDragging(true),
		onDragEnd: () => setDragging(false)
	})

	useDrop(linker, {
		onDom: (active_id: string) => {
			// const active = document.getElementById(active_id) as HTMLDivElement
			// const over = target as HTMLDivElement

			// if (active_id === over.getAttribute('data-id')) return

			// setLinkPositions({
			// 	start: getRelativePostion(container.current, active) + 7,
			// 	end: getRelativePostion(container.current, over) + 7
			// })

			addIfIds(active_id, id)
			setHovering(false)
		},
		onDragEnter: () => setHovering(true),
		onDragLeave: () => setHovering(false)
	})

	if (type === 'group') {
		return (
			<div className={$cx('flex flex_column', styles.group_wrap)}>
				<span className='group_title'>{text}</span>
			</div>
		)
	}

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
					(dragging || hovering) && 'linking',
					item.if_ids?.length && 'linked'
				)}
				ref={linker}
				data-id={id}
				onDragOver={(e) => {
					// console.log(e)
				}}
			></div>
			<div className='action_wrap flex justify_center align_center cursor_point clickable'>
				<If condition={item.status === 'unchecked'}>
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
