import { useDrag, useDrop, useMemoizedFn } from 'ahooks'
import { Dropdown } from 'antd'
import { debounce } from 'lodash-es'
import { Fragment, useState, useRef, useEffect } from 'react'
import { Switch, Case } from 'react-if'

import { todo } from '@/appdata'
import { id as genID, purify } from '@/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Square, CheckSquare, DotsSixVertical } from '@phosphor-icons/react'

import { getCursorPosition, setCursorPosition } from '../../utils'
import Children from '../Children'
import { useContextMenu } from './hooks'
import styles from './index.css'

import type { IPropsTodoItem, IPropsChildren } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const { item, index, drag_disabled, makeLinkLine, check, updateRelations, insert, update, tab, remove } = props
	const { id, text, status, children } = item
	const linker = useRef<HTMLDivElement>(null)
	const input = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)
	const [fold, setFold] = useState(false)
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id,
		data: { index }
	})
	const { TodoContextMenu, ChildrenContextMenu } = useContextMenu()

	useEffect(() => {
		const el = input.current

		if (el.innerHTML === text) return

		el.innerHTML = purify(text)
	}, [text])

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
			async ({ target: { innerHTML } }) => {
				if (innerHTML?.length > todo.text_max_length) {
					innerHTML = purify(innerHTML).slice(0, todo.text_max_length)

					input.current.blur()

					input.current.innerHTML = innerHTML

					await update({ type: 'parent', index, value: { text: innerHTML } })
				} else {
					const filter_text = purify(innerHTML)

					if (innerHTML !== filter_text) {
						input.current.blur()

						input.current.innerHTML = filter_text

						await update({ type: 'parent', index, value: { text: filter_text } })
					} else {
						const start = getCursorPosition(input.current)

						await update({ type: 'parent', index, value: { text: filter_text } })

						if (document.activeElement !== input.current) return

						setCursorPosition(input.current, start)
					}
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

		if (e.key === 'Tab') {
			e.preventDefault()

			tab({ type: 'in', index })
		}
	})

	const insertChildren = useMemoizedFn(async (children_index?: number) => {
		const children = [...item.children]
		const target = { id: genID(), text: '', status: 'unchecked' } as const

		if (children_index === undefined) {
			children.push(target)
		} else {
			children.splice(children_index + 1, 0, target)
		}

		await update({ type: 'children', index, value: children })

		setTimeout(() => document.getElementById(`todo_${target.id}`)?.focus(), 0)
	})

	const removeChildren = useMemoizedFn(async (children_index: number) => {
		const children = [...item.children]

		children.splice(children_index, 1)

		await update({ type: 'children', index, value: children })
	})

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'detail':
				break
			case 'insert':
				insert({ index })
				break
			case 'insert_children':
				insertChildren()
				break
			case 'remove':
				remove(id)
				break
		}
	})

	const props_children: IPropsChildren = {
		items: children,
		index,
		fold,
		handled: item.status === 'checked' || item.status === 'closed',
		ChildrenContextMenu,
		update,
		tab,
		insertChildren,
		removeChildren
	}

	return (
		<Fragment>
			<div
				className={$cx(
					'w_100 border_box flex align_start relative',
					styles.todo_item,
					styles[item.status]
				)}
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
				<Dropdown
					destroyPopupOnHide
					trigger={['contextMenu']}
					overlayStyle={{ width: 132 }}
					menu={{ items: TodoContextMenu, onClick: onContextMenu }}
				>
					<div
						id={`todo_${id}`}
						className='text_wrap'
						ref={input}
						contentEditable
						onInput={onInput}
						onKeyDown={onKeyDown}
					></div>
				</Dropdown>
			</div>
			{children && <Children {...props_children}></Children>}
		</Fragment>
	)
}

export default $app.memo(Index)
