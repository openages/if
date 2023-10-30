import { useDrag, useDrop, useMemoizedFn, useUpdateEffect, usePrevious } from 'ahooks'
import { Dropdown, ConfigProvider } from 'antd'
import { debounce } from 'lodash-es'
import { Fragment, useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { Switch, Case, When } from 'react-if'

import { todo } from '@/appdata'
import { id as genID, purify } from '@/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { deepEqual } from '@openages/stk'
import { Square, CheckSquare, DotsSixVertical } from '@phosphor-icons/react'

import { getCursorPosition, setCursorPosition } from '../../utils'
import Children from '../Children'
import TagSelect from '../TagSelect'
import { useContextMenu } from './hooks'
import styles from './index.css'

import type { IPropsTodoItem, IPropsChildren } from '../../types'
import type { Todo } from '@/types'
const Index = (props: IPropsTodoItem) => {
	const {
		item,
		index,
		tags,
		angles,
		drag_disabled,
		makeLinkLine,
		renderLines,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove
	} = props
	const { id, text, status, tag_ids, tag_width, children } = item
	const linker = useRef<HTMLDivElement>(null)
	const input = useRef<HTMLDivElement>(null)
	const tags_wrap = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)
	const [fold, setFold] = useState(true)
	const { attributes, listeners, transform, transition, isDragging, setNodeRef, setActivatorNodeRef } = useSortable(
		{
			id,
			data: { index }
		}
	)
	const { TodoContextMenu, ChildrenContextMenu } = useContextMenu({ angles })
	const prev_children = usePrevious(children)

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return

		const checked_children = children.filter((item) => item.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])

	useUpdateEffect(() => {
		if (deepEqual(children, prev_children)) return

		setFold(children?.length === 0)
	}, [children, prev_children])

	useEffect(() => {
		const el = input.current

		if (el.innerHTML === text) return

		el.innerHTML = purify(text)
	}, [text])

	useEffect(() => {
		if (isDragging) setFold(true)
	}, [isDragging])

	useUpdateEffect(() => renderLines(id), [fold])

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

	const toggleChildren = useMemoizedFn(() => setFold(!fold))

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
		const children = [...(item.children || [])]
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
		const children = [...(item.children || [])]

		children.splice(children_index, 1)

		await update({ type: 'children', index, value: children })
	})

	const onContextMenu = useMemoizedFn(({ key, keyPath }) => {
		if (keyPath.length > 1) {
			const parent_key = keyPath.at(-1)
			const angle_id = keyPath.at(0)

			switch (parent_key) {
				case 'move':
					moveTo(id, angle_id)
					break
			}
		} else {
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
		}
	})

	const updateTags = useMemoizedFn((v) => {
		if (v?.length > 3) return

		update({ type: 'parent', index, value: { tag_ids: v } as Todo.Todo })
	})

	const updateTagWidth = useMemoizedFn((v) => {
		update({ type: 'parent', index, value: { tag_width: v } as Todo.Todo })
	})

	const target_tag_width = useMemo(() => {
		if (tag_ids.length) {
			return tag_width ? tag_width - 2 : 'unset'
		} else {
			return 'unset'
		}
	}, [tag_ids, tag_width])

	const props_children: IPropsChildren = {
		items: children,
		index,
		fold,
		isDragging,
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
						onClick={toggleChildren}
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
				<When condition={Boolean(tags) && tags?.length && tag_ids?.length}>
					<div className='tags_wrap flex align_center absolute z_index_1000' ref={tags_wrap}>
						<TagSelect
							options={tags}
							value={tag_ids}
							useByTodo
							onChange={updateTags}
							onWidth={updateTagWidth}
						></TagSelect>
					</div>
				</When>
				<ConfigProvider getPopupContainer={() => document.body}>
					<Dropdown
						destroyPopupOnHide
						trigger={['contextMenu']}
						overlayStyle={{ width: 132 }}
						menu={{ items: TodoContextMenu, onClick: onContextMenu }}
					>
						<div
							id={`todo_${id}`}
							className={$cx('text_wrap', children && children?.length && 'has_children')}
							ref={input}
							contentEditable
							style={{ textIndent: target_tag_width }}
							onInput={onInput}
							onKeyDown={onKeyDown}
						></div>
					</Dropdown>
				</ConfigProvider>
			</div>
			<Children {...props_children}></Children>
		</Fragment>
	)
}

export default $app.memo(Index)
