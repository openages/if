import { useMemoizedFn } from 'ahooks'
import { Popover } from 'antd'
import { useMemo, useState } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical, PencilSimple, Trash } from '@phosphor-icons/react'

import { useTimes } from '../../hooks'
import SessionEditor from '../SessionEditor'

import type { IPropsSessionsEditModalItem } from '../../types'

const Index = (props: IPropsSessionsEditModalItem) => {
	const { item, index, disabled, timeline, update, remove } = props
	const { title, work_time, break_time, flow_mode } = item
	const { target_work_time, target_break_time } = useTimes({ work_time, break_time })
	const [edit_open, setEditOpen] = useState(false)
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: item.id,
		data: { index }
	})

	const onRemove = useMemoizedFn(() => remove(index))
	const onUpdate = useMemoizedFn(v => update(index, v))
	const onEditOpenChange = useMemoizedFn((v?: boolean) => setEditOpen(v ? v : false))

	const work_height = useMemo(() => {
		if (work_time < 50) return 60
		if (flow_mode) return work_time >= 60 ? 90 : work_time * 1.2

		return work_time * 2.1
	}, [flow_mode, work_time])

	const break_height = useMemo(() => {
		if (break_time < 30) return 30

		return break_time * 2.1
	}, [flow_mode, break_time])

	return (
		<div
			id={item.id}
			className={$cx('session_item_wrap flex flex_column align_center', disabled && 'disabled')}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			<div
				className={$cx(
					'work_time time w_100 flex justify_center align_center relative',
					flow_mode && 'flow_mode'
				)}
				style={{ height: work_height }}
			>
				{!flow_mode && timeline?.current === 'work' && (
					<span className='timeline absolute' style={{ top: timeline?.time * 2.1 }}></span>
				)}
				<span className='number_wrap flex justify_center align_center absolute top_0 left_0'>
					{index + 1}
				</span>
				<div className='actions_wrap w_100 border_box none justify_between absolute'>
					<div
						className='btn_remove icon_wrap border_box flex justify_center align_center clickable'
						onClick={onRemove}
					>
						<Trash size={10}></Trash>
					</div>
					<div
						className='btn_drag icon_wrap border_box flex justify_center align_center clickable'
						ref={setActivatorNodeRef}
						{...attributes}
						{...listeners}
					>
						<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
					</div>
					<Popover
						trigger='click'
						placement='left'
						destroyTooltipOnHide
						align={{ offset: [-54] }}
						open={edit_open}
						content={
							<SessionEditor
								item={item}
								onChange={onUpdate}
								close={onEditOpenChange}
							></SessionEditor>
						}
						getPopupContainer={() => document.body}
						onOpenChange={onEditOpenChange}
					>
						<div>
							<div className='btn_edit icon_wrap border_box flex justify_center align_center clickable relative'>
								<PencilSimple size={10}></PencilSimple>
							</div>
						</div>
					</Popover>
				</div>
				<span className='work_time_value flex flex_column'>
					{title && <span className='title w_100 text_center mb_6'>{title}</span>}
					<span>
						{target_work_time.hours}:{target_work_time.minutes}
					</span>
				</span>
			</div>
			{!flow_mode && (
				<div
					className='break_time time w_100 flex justify_center align_center relative'
					style={{ height: break_height }}
				>
					{timeline?.current === 'break' && (
						<span className='timeline absolute' style={{ top: timeline?.time * 2.1 }}></span>
					)}
					<span className='break_time_value'>
						{target_break_time.hours}:{target_break_time.minutes}
					</span>
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
