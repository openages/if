import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Case, Switch } from 'react-if'

import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CheckSquare, DotsSixVertical, Square } from '@phosphor-icons/react'

import { useInput } from '../../hooks'
import Children from '../Children'
import CycleStatus from '../CycleStatus'
import DeadlineStatus from '../DeadlineStatus'
import LevelStatus from '../LevelStatus'
import RemindStatus from '../RemindStatus'
import ScheduleStatus from '../ScheduleStatus'
import TagSelect from '../TagSelect'
import { useContextMenu, useHandlers, useLink, useOnContextMenu, useOpen, useOptions } from './hooks'
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
		kanban_mode,
		dimension_id,
		drag_overlay,
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
	} = sortable_props

	const {
		isOver,
		active,
		setNodeRef: setDropRef
	} = useDroppable({
		id,
		data: { index, dimension_id },
		disabled: kanban_mode !== 'angle'
	})

	const { open, onCheck, onDrag, setOpen, toggleChildren, insertChildren, removeChildren, onKeyDown, updateTags } =
		useHandlers({
			item,
			index,
			kanban_mode,
			dimension_id,
			makeLinkLine,
			check,
			insert,
			update,
			tab,
			handleOpenItem
		})

	const { linker, dragging, hovering } = useLink({ item, dimension_id, makeLinkLine, updateRelations })

	const { input, onInput } = useInput({
		value: text,
		update: useMemoizedFn(textContent =>
			update({ type: 'parent', index, dimension_id, value: { text: textContent } })
		)
	})

	const { TodoContextMenu, ChildrenContextMenu } = useContextMenu({ kanban_mode, angles, tags, tag_ids })

	const { onContextMenu } = useOnContextMenu({
		item,
		index,
		kanban_mode,
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

	const { remind } = useOptions({ item, input, zen_mode })

	const props_children: IPropsChildren = {
		items: children,
		index,
		open,
		isDragging,
		handled: item.status === 'checked' || item.status === 'closed',
		dimension_id,
		ChildrenContextMenu,
		update,
		tab,
		insertChildren,
		removeChildren
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
				<div className='flex align_center'>
					{tags?.length > 0 && tag_ids?.length > 0 && (
						<TagSelect
							className='tag_select'
							options={tags}
							value={tag_ids}
							useByTodo
							onChange={updateTags}
						></TagSelect>
					)}
					{schedule && <ScheduleStatus></ScheduleStatus>}
					{remind_time && <RemindStatus remind_time={remind_time}></RemindStatus>}
					{status === 'unchecked' && end_time && (
						<DeadlineStatus end_time={end_time}></DeadlineStatus>
					)}
					{cycle_enabled && cycle && cycle.value !== undefined && (
						<CycleStatus cycle={cycle} recycle_time={recycle_time}></CycleStatus>
					)}
					{level > 0 && <LevelStatus level={level}></LevelStatus>}
				</div>
			</div>
		),
		[open, status, tags, tag_ids, schedule, remind_time, end_time, cycle_enabled, cycle, level]
	)

	const is_dragging = useMemo(() => kanban_mode && isDragging, [kanban_mode, isDragging])

	const is_over = useMemo(
		() => kanban_mode && isOver && active.data.current.dimension_id !== dimension_id,
		[kanban_mode, isOver, active, dimension_id]
	)

	const outdate = useMemo(() => zen_mode && dayjs(end_time).valueOf() < new Date().valueOf(), [zen_mode, end_time])

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column',
				styles.todo_item_wrap,
				zen_mode && styles.zen_mode,
				kanban_mode && styles.kanban_mode,
				kanban_mode === 'tag' && styles.tag_mode,
				!children?.length && styles.no_children,
				is_dragging && styles.is_dragging,
				is_over && styles.is_over,
				drag_overlay && 'todo_item_drag_overlay'
			)}
			ref={ref => {
				setSortRef(ref)
				setDropRef(ref)
			}}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			{is_over && <div className='over_line absolute left_0 flex align_center'></div>}
			<div
				className={$cx(
					'w_100 border_box flex align_start relative',
					styles.todo_item,
					styles[item.status]
				)}
			>
				{!drag_disabled && (
					<div
						id={id}
						className={$cx(
							'dot_wrap border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10',
							dragging && 'dragging',
							hovering && 'hovering'
						)}
						ref={kanban_mode !== 'tag' ? linker : null}
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
				<div className='w_100 flex'>
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
					<ConfigProvider getPopupContainer={() => document.body}>
						<Dropdown
							destroyPopupOnHide
							trigger={['contextMenu']}
							overlayStyle={{ width: 132 }}
							menu={{
								items: TodoContextMenu,
								onClick: onContextMenu
							}}
						>
							<div
								id={`todo_${id}`}
								className={$cx(
									'text_wrap',
									children && children?.length && !open && 'has_children',
									outdate && 'outdate',
									remind && 'remind'
								)}
								contentEditable='plaintext-only'
								ref={input}
								onInput={onInput}
								onKeyDown={onKeyDown}
							></div>
						</Dropdown>
					</ConfigProvider>
				</div>
			</div>
			<Children {...props_children}></Children>
			{!zen_mode && !kanban_mode && has_options && OptionsWrap}
		</div>
	)
}

export default $app.memo(Index)
