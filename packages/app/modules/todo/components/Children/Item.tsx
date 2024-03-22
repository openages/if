import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'

import { CSS } from '@dnd-kit/utilities'
import { CheckSquare, DotsSixVertical, Square } from '@phosphor-icons/react'

import { useInput } from '../../hooks'
import styles from './index.css'

import type { IPropsChildrenItem } from '../../types'

const Index = (props: IPropsChildrenItem) => {
	const {
		sortable_props,
		item,
		index,
		children_index,
		useByDetail,
		ChildrenContextMenu,
		dimension_id,
		update,
		tab,
		insertChildren,
		removeChildren
	} = props
	const { id, status, text } = item
	const { input, onInput } = useInput({
		value: text,
		update: useMemoizedFn(textContent => update(children_index, { text: textContent }))
	})
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = sortable_props

	const onCheck = useMemoizedFn(() => {
		update(children_index, { status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insertChildren(children_index)
		}

		if (e.key === 'Tab') {
			e.preventDefault()

			tab({ type: 'out', index, children_index, dimension_id })
		}
	})

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'insert':
				insertChildren(children_index)
				break
			case 'move_out':
				tab({ type: 'out', index, children_index, dimension_id })
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
				<Choose>
					<When condition={status === 'unchecked'}>
						<Square size={14} />
					</When>
					<Otherwise>
						<CheckSquare size={14} />
					</Otherwise>
				</Choose>
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
						contentEditable='plaintext-only'
						onInput={onInput}
						onKeyDown={onKeyDown}
					></div>
				</Dropdown>
			</ConfigProvider>
		</div>
	)
}

export default $app.memo(Index)
