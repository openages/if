import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { todo } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'
import { useContextMenu, useHandlers, useLink, useOnContextMenu, useOpen, useOptions } from '@/modules/todo/hooks'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CheckSquare, DotsSixVertical, Square } from '@phosphor-icons/react'

import Children from '../Children'
import CycleStatus from '../CycleStatus'
import DeadlineStatus from '../DeadlineStatus'
import LevelStatus from '../LevelStatus'
import RemindStatus from '../RemindStatus'
import TagSelect from '../TagSelect'
import styles from './index.css'

import type { IPropsChildren, IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const {
		sortable_props,
		item,
		index,
		tags,
		angles,
		drag_disabled,
		zen_mode,
		open_items,
		mode,
		dimension_id,
		drag_overlay,
		useByMindmap,
		makeLinkLine,
		renderLines,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props

	const {
		id,
		status,
		text,
		tag_ids,
		level,
		remind_time,
		end_time,
		cycle_enabled,
		cycle,
		recycle_time,
		schedule,
		children
	} = item

	const {
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
		setNodeRef: setSortRef,
		setActivatorNodeRef
	} = sortable_props || {}

	const {
		isOver,
		active,
		setNodeRef: setDropRef
	} = useDroppable({
		id,
		data: { index, dimension_id }
	})

	const { open, onCheck, onDrag, setOpen, toggleChildren, insertChildren, onKeyDown, updateTags } = useHandlers({
		item,
		index,
		dimension_id,
		makeLinkLine,
		check,
		insert,
		update,
		tab,
		handleOpenItem
	})

	const { linker, dragging, hovering } = useLink({ item, dimension_id, makeLinkLine, updateRelations })

	const { ref_editor, ref_input, onChange, setEditor, setRef } = useText({
		text,
		update: v => update({ type: 'parent', index, dimension_id, value: { text: v } })
	})

	useTextChange({ ref_editor, text })

	const context_menu = useContextMenu({ item, angles, tags, tag_ids })

	const { onContextMenu } = useOnContextMenu({
		item,
		index,
		mode,
		dimension_id,
		update,
		moveTo,
		insert,
		tab,
		remove,
		showDetailModal,
		insertChildren
	})

	useOpen({ item, zen_mode, open, open_items, renderLines, setOpen })
	useOptions({ item, input: ref_input })

	const props_children: IPropsChildren = {
		mode,
		items: children,
		index,
		open,
		isDragging,
		handled: item.status === 'checked' || item.status === 'closed',
		dimension_id,
		update,
		tab
	}

	const has_options = useMemo(
		() =>
			level ||
			tag_ids?.length ||
			remind_time ||
			end_time ||
			(cycle_enabled && cycle && cycle?.value !== undefined) ||
			schedule,
		[level, tag_ids, remind_time, end_time, cycle_enabled, cycle, schedule]
	)

	const OptionsWrap = useMemo(
		() => (
			<div className={$cx('options_wrap w_100 border_box flex align_center', open && 'open', status)}>
				<div className='options_content w_100 flex align_center'>
					{level! > 0 && <LevelStatus level={level}></LevelStatus>}
					{tags?.length > 0 && tag_ids?.length! > 0 && (
						<TagSelect
							className='tag_select'
							options={tags}
							value={tag_ids!}
							useByTodo
							onChange={updateTags}
						></TagSelect>
					)}
					{remind_time && <RemindStatus remind_time={remind_time}></RemindStatus>}
					{status === 'unchecked' && end_time && (
						<DeadlineStatus end_time={end_time}></DeadlineStatus>
					)}
					{cycle_enabled && cycle && cycle.value !== undefined && (
						<CycleStatus cycle={cycle} recycle_time={recycle_time}></CycleStatus>
					)}
				</div>
			</div>
		),
		[open, status, tags, tag_ids, remind_time, end_time, cycle_enabled, cycle, level]
	)

	const is_over = useMemo(
		() => mode === 'quad' && isOver && active!.data.current!.dimension_id !== dimension_id,
		[mode, isOver, active, dimension_id]
	)

	const outdate = useMemo(
		() => zen_mode && end_time && dayjs(end_time).valueOf() < new Date().valueOf(),
		[zen_mode, end_time]
	)

	const disableContextMenu = useMemoizedFn(e => e.preventDefault())

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column',
				styles.todo_item_wrap,
				zen_mode && styles.zen_mode,
				mode === 'kanban' && styles.kanban,
				mode === 'quad' && styles.quad,
				!children?.length && styles.no_children,
				isDragging && styles.is_dragging,
				is_over && styles.is_over,
				useByMindmap && styles.useByMindmap,
				useByMindmap && 'nodrag',
				drag_overlay && 'todo_item_drag_overlay',
				mode === 'kanban' && 'kanban'
			)}
			ref={
				setSortRef &&
				setDropRef &&
				(ref => {
					setSortRef(ref)
					setDropRef(ref)
				})
			}
			style={{ transform: CSS.Translate.toString(transform!), transition }}
			onContextMenu={disableContextMenu}
		>
			{is_over && <div className='over_line w_100 absolute left_0 flex align_center'></div>}
			<div
				className={$cx(
					'w_100 border_box flex align_start relative',
					styles.todo_item,
					styles[item.status]
				)}
			>
				{!useByMindmap && !drag_disabled && (
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
				{!useByMindmap && !drag_disabled && (
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
				<div className='w_100 flex'>
					<div
						className='action_wrap flex justify_center align_center cursor_point clickable'
						onClick={onCheck}
					>
						<Choose>
							<When condition={status === 'unchecked' || status === 'closed'}>
								<Square size={16} />
							</When>
							<When condition={status === 'checked'}>
								<CheckSquare size={16} />
							</When>
						</Choose>
					</div>
					<ConfigProvider getPopupContainer={() => document.body}>
						<Dropdown
							destroyPopupOnHide
							trigger={['contextMenu']}
							overlayStyle={{ width: 132 }}
							menu={{
								items: context_menu,
								onClick: onContextMenu
							}}
						>
							<Text
								id={`todo_${id}`}
								className={$cx(
									'text_wrap',
									mode !== 'mindmap' &&
										children &&
										!!children?.length &&
										!open &&
										'has_children',
									!!outdate && 'outdate'
								)}
								max_length={todo.text_max_length}
								onChange={onChange}
								setEditor={setEditor}
								onKeyDown={onKeyDown}
								setRef={setRef}
							></Text>
						</Dropdown>
					</ConfigProvider>
				</div>
			</div>
			{!useByMindmap && <Children {...props_children}></Children>}
			{!useByMindmap && !zen_mode && has_options && OptionsWrap}
		</div>
	)
}

export default $app.memo(Index)
