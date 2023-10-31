import { useMemoizedFn } from 'ahooks'
import { Dropdown, ConfigProvider } from 'antd'
import { debounce } from 'lodash-es'
import { useRef, useEffect } from 'react'
import { Switch, Case } from 'react-if'

import { todo } from '@/appdata'
import { purify } from '@/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Square, CheckSquare, DotsSixVertical } from '@phosphor-icons/react'

import { getCursorPosition, setCursorPosition } from '../../utils'
import styles from './index.css'

import type { IPropsChildrenItem } from '../../types'

const Index = (props: IPropsChildrenItem) => {
	const {
		item,
		index,
		children_index,
		useByDetail,
		ChildrenContextMenu,
		update,
		tab,
		insertChildren,
		removeChildren
	} = props
	const { id, text, status } = item
	const input = useRef<HTMLDivElement>(null)
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id,
		data: { index: children_index }
	})

	useEffect(() => {
		const el = input.current

		if (el.innerHTML === text) return

		el.innerHTML = purify(text)
	}, [text])

	const onInput = useMemoizedFn(
		debounce(
			async ({ target: { innerHTML } }) => {
				if (innerHTML?.length > todo.text_max_length) {
					innerHTML = purify(innerHTML).slice(0, todo.text_max_length)

					input.current.blur()

					input.current.innerHTML = innerHTML

					await update(children_index, { text: innerHTML })
				} else {
					const filter_text = purify(innerHTML)

					if (innerHTML !== filter_text) {
						input.current.blur()

						input.current.innerHTML = filter_text

						await update(children_index, { text: filter_text })
					} else {
						const start = getCursorPosition(input.current)

						await update(children_index, { text: filter_text })

						if (document.activeElement !== input.current) return

						setCursorPosition(input.current, start)
					}
				}
			},
			450,
			{ leading: false }
		)
	)

	const onCheck = useMemoizedFn(() => {
		update(children_index, { status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const onKeyDown = useMemoizedFn((e) => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insertChildren(children_index)
		}

		if (e.key === 'Tab') {
			e.preventDefault()

			tab({ type: 'out', index, children_index })
		}
	})

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'insert':
				insertChildren(children_index)
				break
			case 'move_out':
				tab({ type: 'out', index, children_index })
				break
			case 'remove':
				removeChildren(children_index)
				break
		}
	})

	return (
		<div
			className={$cx(
				'todo_child_item w_100 flex align_start relative',
				item.status === 'checked' && styles.checked
			)}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			<div
				className={$cx(
					'drag_wrap children border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10'
				)}
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<DotsSixVertical size={10} weight='bold'></DotsSixVertical>
			</div>
			<div
				className='action_wrap flex justify_center align_center cursor_point clickable'
				onClick={onCheck}
			>
				<Switch>
					<Case condition={status === 'unchecked'}>
						<Square size={14} />
					</Case>
					<Case condition={status === 'checked'}>
						<CheckSquare size={14} />
					</Case>
				</Switch>
			</div>
			<ConfigProvider getPopupContainer={() => document.body}>
				<Dropdown
					destroyPopupOnHide
					trigger={['contextMenu']}
					overlayStyle={{ width: 102 }}
					menu={{ items: ChildrenContextMenu, onClick: onContextMenu }}
				>
					<div
						id={`${useByDetail ? 'detail_' : ''}todo_${id}`}
						className='text_wrap'
						ref={input}
						contentEditable
						onInput={onInput}
						onKeyDown={onKeyDown}
					></div>
				</Dropdown>
			</ConfigProvider>
		</div>
	)
}

export default $app.memo(Index)
