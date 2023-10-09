import { useDrag, useDrop, useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useState, useRef, useEffect } from 'react'
import { Switch, Case } from 'react-if'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Square, CheckSquare, DotsSixVertical } from '@phosphor-icons/react'

import { getCursorPosition, setCursorPosition } from '../../utils'
import styles from './index.css'

import type { IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const { item, index, drag_disabled, makeLinkLine, check, updateRelations, insert, update } = props
	const { id, text, status } = item
	const linker = useRef<HTMLDivElement>(null)
	const input = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id,
		data: { index }
	})

	useEffect(() => {
		const el = input.current

		if (el.innerText === '') el.focus()
	}, [])

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

	const onInput = useMemoizedFn(
		debounce(
			async ({ target: { innerText } }) => {
				if (innerText?.length > 360) {
					innerText = innerText.slice(0, 360)

					input.current.blur()

					input.current.innerText = innerText

					await update({ type: 'parent', index, value: { text: innerText } })
				} else {
					const start = getCursorPosition(input.current)

					await update({ type: 'parent', index, value: { text: innerText } })

					setCursorPosition(input.current, start)
				}
			},
			450,
			{ leading: false }
		)
	)

	const onKeyDown = useMemoizedFn((e) => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insert({ index })
		}
      })

	return (
		<div
			className={$cx('w_100 border_box flex align_start relative', styles.todo_item, styles[item.status])}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			{!drag_disabled && (
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
			)}
			{!drag_disabled && (
				<div
					className={$cx(
						'drag_wrap todo border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10'
					)}
					ref={setActivatorNodeRef}
					{...attributes}
					{...listeners}
				>
					<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
				</div>
			)}
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
			<div
				className='text_wrap'
				ref={input}
				contentEditable
				dangerouslySetInnerHTML={{ __html: text }}
				onInput={onInput}
				onKeyDown={onKeyDown}
			></div>
		</div>
	)
}

export default $app.memo(Index)
