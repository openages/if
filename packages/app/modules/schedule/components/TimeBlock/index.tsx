import { Dropdown, Popover } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { schedule } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, Info, X } from '@phosphor-icons/react'

import { useDragLength } from '../../hooks'
import { getTimeText } from '../../utils'
import TimeBlockDetail from '../TimeBlockDetail'
import { useContextMenuItems, useHandlers, useLook, useTagStyles, useTime, useTodos, useVisibleDetail } from './hooks'
import styles from './index.css'

import type { IPropsTimeBlock } from '../../types'

const Index = (props: IPropsTimeBlock) => {
	const {
		unpaid,
		item,
		tags,
		day_index,
		angle_row_id,
		timeblock_index,
		month_mode,
		step,
		at_bottom,
		year_scale,
		dnd_data,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props
	const context_menu_items = useContextMenuItems()
	const { t } = useTranslation()
	const { visible_detail, toggleVisibleDetail } = useVisibleDetail()
	const status = useTodos(item?.todos || [])
	const tag_styles = useTagStyles(tags, item.tag)
	const timeline = useMemo(() => angle_row_id !== undefined, [angle_row_id])
	const look = useLook({ item, month_mode, step, timeline })
	const time = useTime({ year_scale, item, timeline })
	const { start_time, end_time } = item

	const [focus, setFocus] = useState(false)

	const { stopPropagationContextMenu, onKeyDown, onAction } = useHandlers({
		item,
		copyTimeBlock,
		removeTimeBlock,
		toggleVisibleDetail
	})

	const {
		attributes,
		listeners,
		transform,
		isDragging,
		setNodeRef: setDragRef,
		setActivatorNodeRef
	} = useDraggable({
		id: item.id,
		disabled: month_mode || focus,
		data: { day_index, angle_row_id, timeblock_index }
	})

	const {
		isOver,
		active,
		setNodeRef: setDropRef
	} = useDroppable({
		id: `drop_container_${item.id}`,
		data: { signal: 'task_panel_drop_container', day_index, angle_row_id, timeblock_index, ...dnd_data }
	})

	const { drag_ref } = useDragLength({
		day_index,
		angle_row_id,
		step,
		timeblock_index,
		changeTimeBlockLength: changeTimeBlockLength!
	})

	const { ref_editor, onChange, setEditor, setRef } = useText({
		text: item.text,
		update: v => updateTimeBlock(item.id, { text: v })
	})

	const { value: time_value } = useMemo(
		() => getTimeText(dayjs(item.start_time), dayjs(item.end_time)),
		[start_time, end_time]
	)

	useTextChange({ ref_editor, text: item.text })

	return (
		<Popover
			open={visible_detail}
			content={<TimeBlockDetail item={item} tags={tags} updateTimeBlock={updateTimeBlock} />}
			zIndex={1000}
			classNames={{ root: $cx('border_popover', 'month_mode_timeblock_popover') }}
			destroyTooltipOnHide
			placement={at_bottom ? 'bottom' : 'right'}
			getPopupContainer={() => document.body}
		>
			<Dropdown
				destroyPopupOnHide
				trigger={['contextMenu']}
				overlayStyle={{ width: 90 }}
				menu={{
					items: context_menu_items,
					onClick: onAction
				}}
			>
				<div
					id={item.id}
					className={$cx(
						'timeblock_item_wrap w_100 border_box flex flex_column',
						styles._local,
						unpaid && styles.unpaid,
						tag_styles['--tag_color'] ? styles.has_tag : styles.no_tag,
						isDragging && styles.isDragging,
						month_mode && visible_detail && styles.visible_detail,
						active?.data?.current?.signal === 'task_panel' && isOver && styles.isOver,
						...look.class
					)}
					style={{
						transform: month_mode ? 'unset' : CSS.Translate.toString(transform),
						...look.style,
						...tag_styles
					}}
					ref={ref => {
						setDragRef(ref)
						setDropRef(ref)
					}}
					{...attributes}
					onContextMenu={stopPropagationContextMenu}
				>
					<If condition={!month_mode}>
						<div className='drag_line w_100 absolute bottom_0 right_0' ref={drag_ref}></div>
					</If>
					<div
						className={$cx(
							'btn_detail none justify_center align_center absolute clickable',
							visible_detail && 'visible_detail'
						)}
						onClick={toggleVisibleDetail}
					>
						{visible_detail ? <X size={12}></X> : <Info size={14}></Info>}
					</div>
					<div
						className='timeblock_content_wrap w_100 h_100 border_box flex flex_column absolute top_0 left_0'
						ref={!month_mode ? setActivatorNodeRef : null}
						{...listeners}
					>
						<div
							className={$cx(
								'text_scroll_wrap w_100',
								month_mode && status && 'has_status'
							)}
						>
							<Text
								className='text_wrap w_100 border_box'
								placeholder_classname='timeblock_placeholder'
								max_length={schedule.text_max_length}
								placeholder={t('schedule.timeblock_placeholder')}
								onChange={onChange}
								setEditor={setEditor}
								onKeyDown={onKeyDown}
								onFocus={setFocus}
								setRef={setRef}
							></Text>
						</div>
						{((!month_mode && time_value >= 45) || timeline) && (
							<div className='time flex justify_between align_center relative'>
								<div className={$cx('time_value flex', status && 'has_status')}>
									<span className='mr_4'>{time.time}</span>
									<span>{time.cross_time}</span>
								</div>
								<span className='status flex justify_center align_center absolute'>
									{status &&
										(status === 'ok' ? (
											<Check weight='bold'></Check>
										) : (
											<span>{status}</span>
										))}
								</span>
							</div>
						)}
					</div>
					{month_mode && status && (
						<span className='status flex justify_center align_center absolute'>
							<Check weight='bold'></Check>
						</span>
					)}
				</div>
			</Dropdown>
		</Popover>
	)
}

export default $app.memo(Index)
