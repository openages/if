import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'

import { todo } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'
import { CSS } from '@dnd-kit/utilities'
import { CheckSquare, DotsSixVertical, Square } from '@phosphor-icons/react'

import { useChildrenContextMenu } from '../../hooks'
import styles from './index.css'

import type { IPropsChildrenItem } from '../../types'
import type { Todo } from '@/types'
import type { RefAttributes, HTMLAttributes } from 'react'

const Index = (props: IPropsChildrenItem) => {
	const {
		sortable_props,
		mode,
		kanban_mode,
		item,
		index,
		children_index,
		dimension_id,
		useByDetail,
		useByMindmap,
		update,
		tab
	} = props
	const { id, status, text } = item
	const context_menu = useChildrenContextMenu({ mode, kanban_mode })
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = sortable_props || {}

	const updateChildren = useMemoizedFn(
		async (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => {
			await update({ type: 'children_item', index, children_index, dimension_id, value: value })
		}
	)

	const { ref_editor, onChange, setEditor, setRef } = useText({
		update: v => updateChildren(children_index, { text: v })
	})

	useTextChange({ ref_editor, text })

	const onCheck = useMemoizedFn(() => {
		updateChildren(children_index, { status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const insertChildren = useMemoizedFn(async () => {
		await update({ type: 'insert_children_item', index, children_index, dimension_id, value: {} })
	})

	const removeChildren = useMemoizedFn(async () => {
		await update({ type: 'remove_children_item', index, children_index, dimension_id, value: {} })
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insertChildren()
		}

		if (e.key === 'Tab') {
			e.preventDefault()

			tab({ type: 'out', index, children_index, dimension_id })
		}
	})

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'insert':
				insertChildren()
				break
			case 'move_out':
				tab({ type: 'out', index, children_index, dimension_id })
				break
			case 'remove':
				removeChildren()
				break
		}
	})

	const sortable_attrs: RefAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> = !useByMindmap && {
		ref: setNodeRef,
		style: { transform: CSS.Translate.toString(transform), transition }
	}

	return (
		<div
			className={$cx(
				'todo_child_item w_100 flex align_start relative nodrag',
				item.status === 'checked' && styles.checked,
				styles.todo_child_item,
				useByMindmap && styles.useByMindmap
			)}
			{...sortable_attrs}
		>
			<If condition={!useByMindmap}>
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
			</If>
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
					menu={{ items: context_menu, onClick: onContextMenu }}
				>
					<Text
						id={`${useByDetail ? 'detail_' : ''}todo_${id}`}
						className='text_wrap'
						max_length={todo.text_max_length}
						onChange={onChange}
						setEditor={setEditor}
						onKeyDown={onKeyDown}
						setRef={setRef}
					></Text>
				</Dropdown>
			</ConfigProvider>
		</div>
	)
}

export default $app.memo(Index)
