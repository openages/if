import { Dropdown, ConfigProvider } from 'antd'
import { Fragment } from 'react'
import { Switch, Case, When } from 'react-if'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Square, CheckSquare, DotsSixVertical } from '@phosphor-icons/react'

import Children from '../Children'
import TagSelect from '../TagSelect'
import { useContextMenu, useHandlers, useLink, useInput, useOpen, useOnContextMenu, useTagWidth } from './hooks'
import styles from './index.css'

import type { IPropsTodoItem, IPropsChildren } from '../../types'

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
		remove,
		showDetailModal
	} = props
	const { id, status, open, tag_ids, children } = item
	const { attributes, listeners, transform, transition, isDragging, setNodeRef, setActivatorNodeRef } = useSortable(
		{ id, data: { index } }
	)
	const {
		setOpen,
		onCheck,
		onDrag,
		toggleChildren,
		insertChildren,
		removeChildren,
		onKeyDown,
		updateTags,
		updateTagWidth
	} = useHandlers({ item, index, makeLinkLine, check, insert, update, tab })
	const { linker, dragging, hovering } = useLink({ item, makeLinkLine, updateRelations })
	const { input, onInput } = useInput({ item, index, update })
	const { TodoContextMenu, ChildrenContextMenu } = useContextMenu({ angles, tags, tag_ids })
	const { onContextMenu } = useOnContextMenu({
		item,
		index,
		update,
		moveTo,
		insert,
		tab,
		remove,
		showDetailModal,
		insertChildren
	})
	const { target_tag_width } = useTagWidth({ item })

	useOpen({ item, input, isDragging, renderLines, setOpen })

	const props_children: IPropsChildren = {
		items: children,
		index,
		fold: !open,
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
					<div className='tags_wrap flex align_center absolute z_index_1000'>
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
							className={$cx(
								'text_wrap',
								children && children?.length && !open && 'has_children'
							)}
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
