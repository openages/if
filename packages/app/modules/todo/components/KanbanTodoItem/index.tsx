import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { todo } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle, Circle, DotsSixVertical } from '@phosphor-icons/react'

import FlatLevel from '../FlatLevel'
import { Children, Deadline, Remind, Repeat, Tags } from './components'
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
		mode,
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

	const { id, status, text, tag_ids, level, remind_time, end_time, cycle_enabled, cycle, recycle_time, children } =
		item

	const {
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
		setNodeRef: setSortRef,
		setActivatorNodeRef
	} = sortable_props || {}

	const { isOver, active, setNodeRef: setDropRef } = useDroppable({ id, data: { index, dimension_id } })

	const { onCheck, insertChildren, onKeyDown, updateTags } = useHandlers({
		item,
		index,
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

	const context_menu = useContextMenu({ angles, tags, tag_ids })

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

	useOptions({ item, input: ref_input })

	const children_status = useMemo(() => {
		if (!children || !children.length) return

		const checked = children.filter(item => item.status === 'checked')

		return { total: children.length, checked: checked.length }
	}, [children])

	const is_over = useMemo(
		() => isOver && active!.data.current!.dimension_id !== dimension_id,
		[isOver, active, dimension_id]
	)

	const outdate = useMemo(() => end_time && dayjs(end_time).valueOf() < new Date().valueOf(), [end_time])

	const disableContextMenu = useMemoizedFn(e => e.preventDefault())

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column relative',
				styles.todo_item_wrap,
				isDragging && styles.is_dragging,
				is_over && styles.is_over,
				styles[status],
				drag_overlay && 'todo_item_drag_overlay flat'
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

			<div className='header_wrap w_100 flex justify_between align_center'>
				<div className='flex align_center'>
					<div
						className='actions_wrap fix_width flex justify_center align_center cursor_point clickable mr_6'
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
					<div className='serial_number'>
						<span>{serial ?? 'DAG'}</span>
						<span className='line'>-</span>
						<span>{index + 1}</span>
					</div>
				</div>
				<div
					className={$cx(
						'drag_wrap border_box flex justify_center align_center transition_normal cursor_point'
					)}
					ref={setActivatorNodeRef}
					{...attributes}
					{...listeners}
				>
					<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
				</div>
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
			<div className='options_wrap flex flex_wrap align_center'>
				<div className='option_item fix_width flex justify_center align_center'>
					<FlatLevel no_padding value={level}></FlatLevel>
				</div>
				{children_status && <Children {...children_status}></Children>}
				{tags?.length > 0 && tag_ids?.length! > 0 && (
					<Tags useByKanban tags={tags} tag_ids={tag_ids} updateTags={updateTags}></Tags>
				)}
				{remind_time && <Remind remind_time={remind_time}></Remind>}
				{status === 'unchecked' && end_time && <Deadline end_time={end_time}></Deadline>}
				{cycle_enabled && cycle && cycle.value !== undefined && (
					<Repeat cycle={cycle} recycle_time={recycle_time}></Repeat>
				)}
			</div>
		</div>
	)
}

export default $app.memo(Index)
