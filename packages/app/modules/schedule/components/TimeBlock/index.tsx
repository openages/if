import { useMemoizedFn } from 'ahooks'
import { Dropdown, Popover } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useInput } from '@/modules/todo/hooks'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, Info, X } from '@phosphor-icons/react'

import { useDragLength } from '../../hooks'
import TimeBlockDetail from '../TimeBlockDetail'
import { useContextMenuItems, useHandlers, useLook, useTagStyles, useTime, useTodos, useVisibleDetail } from './hooks'
import styles from './index.css'

import type { IPropsTimeBlock } from '../../types'

const Index = (props: IPropsTimeBlock) => {
	const {
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
		disabled: month_mode,
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
		changeTimeBlockLength
	})

	const { input, onInput } = useInput({
		value: item.text,
		max_length: 60,
		update: useMemoizedFn(textContent => updateTimeBlock(item.id, { text: textContent }))
	})

	return (
		<Popover
			open={visible_detail}
			content={<TimeBlockDetail item={item} tags={tags} updateTimeBlock={updateTimeBlock} />}
			zIndex={1000}
			overlayClassName={$cx('border_popover', 'month_mode_timeblock_popover')}
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
					className={$cx(
						'timeblock_item_wrap w_100 border_box flex flex_column',
						styles._local,
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
					<When condition={!month_mode}>
						<div className='drag_line w_100 absolute bottom_0 right_0' ref={drag_ref}></div>
					</When>
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
							<div
								className='text_wrap w_100 border_box'
								ref={input}
								contentEditable='plaintext-only'
								data-placeholder={t('translation:schedule.timeblock_placeholder')}
								onInput={onInput}
								onKeyDown={onKeyDown}
							></div>
						</div>
						{((!month_mode && item.length > 1) || timeline) && (
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
