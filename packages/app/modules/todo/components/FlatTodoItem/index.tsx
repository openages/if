import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { todo } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle, Circle } from '@phosphor-icons/react'

import CycleStatus from '../CycleStatus'
import DeadlineStatus from '../DeadlineStatus'
import FlatLevel from '../FlatLevel'
import LevelStatus from '../LevelStatus'
import RemindStatus from '../RemindStatus'
import TagSelect from '../TagSelect'
import { useContextMenu, useHandlers, useOnContextMenu, useOptions } from './hooks'
import styles from './index.css'

import type { IPropsFlatTodoItem } from '../../types'

const Index = (props: IPropsFlatTodoItem) => {
	const {
		sortable_props,
		item,
		index,
		tags,
		angles,
		zen_mode,
		mode,
		kanban_mode,
		dimension_id,
		drag_overlay,
		serial,
		check,
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
		children,
		create_at
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
		data: { index, dimension_id },
		disabled: kanban_mode !== 'angle'
	})

	const { open, onCheck, insertChildren, onKeyDown, updateTags } = useHandlers({
		item,
		index,
		kanban_mode,
		dimension_id,
		check,
		insert,
		update,
		tab,
		handleOpenItem
	})

	const { ref_editor, ref_input, onChange, setEditor, setRef } = useText({
		text,
		update: v => update({ type: 'parent', index, dimension_id, value: { text: v } })
	})

	useTextChange({ ref_editor, text })

	const context_menu = useContextMenu({ kanban_mode, angles, tags, tag_ids })

	const { onContextMenu } = useOnContextMenu({
		item,
		index,
		mode,
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

	useOptions({ item, input: ref_input, zen_mode })

	const date = useMemo(() => {
		const target = dayjs(create_at)

		if (target.diff(dayjs(), 'week') >= 1) return target.format('YYYY-MM-DD')

		return `${dayjs().to(target)} ${target.format('dddd')}`
	}, [create_at])

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
					{kanban_mode && <span className='date_wrap in_options'>{date}</span>}
				</div>
			</div>
		),
		[open, status, tags, tag_ids, remind_time, end_time, cycle_enabled, cycle, level, kanban_mode]
	)

	const is_dragging = useMemo(() => kanban_mode && isDragging, [kanban_mode, isDragging])

	const is_over = useMemo(
		() => (mode === 'quad' || kanban_mode) && isOver && active!.data.current!.dimension_id !== dimension_id,
		[mode, kanban_mode, isOver, active, dimension_id]
	)

	const outdate = useMemo(
		() => zen_mode && end_time && dayjs(end_time).valueOf() < new Date().valueOf(),
		[zen_mode, end_time]
	)

	const disableContextMenu = useMemoizedFn(e => e.preventDefault())

	return (
		<div
			className={$cx(
				'w_100 border_box flex align_center justify_between relative',
				styles.todo_item_wrap,
				is_dragging && styles.is_dragging,
				is_over && styles.is_over,
				styles[status],
				drag_overlay && 'todo_item_drag_overlay'
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
			<FlatLevel value={level}></FlatLevel>
			<div className='serial_number'>
				<span>{serial}</span>
				<span className='line'>-</span>
				<span>{index + 1}</span>
			</div>
			<div
				className='action_wrap flex justify_center align_center cursor_point clickable'
				onClick={onCheck}
			>
				<Choose>
					<When condition={status === 'unchecked' || status === 'closed'}>
						<Circle weight='bold' />
					</When>
					<When condition={status === 'checked'}>
						<CheckCircle weight='fill' color='var(--color_text_grey)' />
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
						className={$cx('text_wrap', !!outdate && 'outdate')}
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
