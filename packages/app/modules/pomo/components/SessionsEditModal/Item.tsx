import { useMemoizedFn } from 'ahooks'

import { DotsSixVertical, PencilSimple, Trash } from '@phosphor-icons/react'

import { useTimes } from '../../hooks'

import type { IPropsSessionsEditModalItem } from '../../types'

const Index = (props: IPropsSessionsEditModalItem) => {
	const { item, index, disabled, update, remove } = props
	const { title, work_time, break_time } = item
	const { target_work_time, target_break_time } = useTimes({ work_time, break_time })

	const onRemove = useMemoizedFn(() => remove(index))

	return (
		<div className={$cx('session_item_wrap flex flex_column align_center', disabled && 'disabled')}>
			<div
				className='work_time time w_100 flex justify_center align_center relative'
				style={{ height: work_time * 2.4 }}
			>
				{title && <span className='title w_100 text_center absolute'>{title}</span>}
				<div className='actions_wrap w_100 border_box none justify_between absolute'>
					<div
						className='btn_remove icon_wrap border_box flex justify_center align_center clickable'
						onClick={onRemove}
					>
						<Trash size={10}></Trash>
					</div>
					<div className='btn_drag icon_wrap border_box flex justify_center align_center clickable'>
						<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
					</div>
					<div className='btn_edit icon_wrap border_box flex justify_center align_center clickable'>
						<PencilSimple size={10}></PencilSimple>
					</div>
				</div>
				<span className='work_time_value'>
					{target_work_time.hours}:{target_work_time.minutes}
				</span>
			</div>
			<div
				className='break_time time w_100 flex justify_center align_center'
				style={{ height: break_time * 2.4 }}
			>
				<span className='break_time_value'>
					{target_break_time.hours}:{target_break_time.minutes}
				</span>
			</div>
		</div>
	)
}

export default $app.memo(Index)
