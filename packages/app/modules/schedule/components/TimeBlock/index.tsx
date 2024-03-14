import { useMemoizedFn } from 'ahooks'
import { Dropdown, Popover } from 'antd'
import Color from 'color'
import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useDeepEffect } from '@/hooks'
import { useInput } from '@/modules/todo/hooks'
import { getDocItemsData } from '@/utils'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, Info, X } from '@phosphor-icons/react'

import { useDragLength } from '../../hooks'
import { getCrossTime } from '../../utils'
import TimeBlockDetail from '../TimeBlockDetail'
import { useContextMenuItems } from './hooks'
import styles from './index.css'

import type { IPropsTimeBlock } from '../../types'
import type { Subscription } from 'rxjs'
import type { Todo } from '@/types'

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
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props
	const [visible_detail, setVisibleDetail] = useState(false)
	const [status, setStatus] = useState('')
	const context_menu_items = useContextMenuItems()
	const { t } = useTranslation()
	const timeline = angle_row_id !== undefined

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

	const { drag_ref } = useDragLength({
		day_index,
		angle_row_id,
		step,
		timeblock_index,
		changeTimeBlockLength
	})

	const closePopover = useMemoizedFn(() => {
		const popovers = document.getElementsByClassName('month_mode_timeblock_popover')

		if (!popovers.length) return

		Array.from(popovers).forEach(i => ((i as HTMLDivElement).style.display = 'none'))
	})

	useEffect(() => {
		return () => {
			closePopover()
			setVisibleDetail(false)
		}
	}, [])

	useDeepEffect(() => {
		let watcher = null as Subscription

		if (item?.todos?.length) {
			watcher = $db.todo_items.findByIds(item.todos).$.subscribe(doc => {
				const items = getDocItemsData(Array.from(doc.values())) as Array<Todo.Todo>

				const done_items = items.filter(item => item.status === 'checked' || item.status === 'closed')

				if (done_items.length !== items.length) {
					setStatus(`${done_items.length}/${items.length}`)
				} else {
					setStatus('ok')
				}
			})
		} else {
			setStatus('')
		}

		return () => watcher?.unsubscribe?.()
	}, [item.todos])

	const { input, onInput } = useInput({
		value: item.text,
		max_length: 60,
		update: useMemoizedFn(textContent => updateTimeBlock(item.id, { text: textContent }))
	})

	const tag_styles = useMemo(() => {
		if (!tags.length) return {}
		if (!item.tag) return {}

		const target = tags.find(it => it.id === item.tag)

		return {
			'--tag_color': Color(target.color).rgb().array().join(',')
		}
	}, [item.tag, tags])

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter' || e.key === 'Tab') {
			e.preventDefault()
		}
	})

	const toggleVisibleDetail = useMemoizedFn(() => setVisibleDetail(!visible_detail))
	const stopPropagationContextMenu = useMemoizedFn(e => e.stopPropagation())

	const onAction = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'check':
				toggleVisibleDetail()
				break
			case 'copy':
				copyTimeBlock(omit(item, 'id'))
				break
			case 'remove':
				removeTimeBlock(item.id)
				break
		}
	})

	const look = useMemo(() => {
		if (timeline) {
			return {
				class: ['absolute', styles.timeline],
				style: {
					left: item.start * step,
					width: item.length * step
				}
			}
		}

		if (month_mode) {
			return {
				class: ['relative', styles.month_mode],
				style: {}
			}
		}

		return {
			class: [
				'absolute',
				item.length === 1 && styles.small,
				item.length === 2 && styles.middle,
				item.length === 3 && styles.large,
				item.length > 3 && styles.xlarge,
				item.past && styles.past
			],
			style: {
				top: item.start * 16,
				height: item.length * 16
			}
		}
	}, [item, month_mode, timeline, step])

	const time = useMemo(() => {
		const start_time = dayjs(item.start_time)
		const end_time = dayjs(item.end_time)
		const cross_time = getCrossTime(start_time, end_time, timeline)

		if (timeline) {
			return {
				time: `${start_time.format('MM.DD')} - ${end_time.format('MM.DD')}`,
				cross_time
			}
		} else {
			return {
				time: `${start_time.format('HH:mm')} - ${end_time.format('HH:mm')}`,
				cross_time
			}
		}
	}, [item, timeline])

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
						tag_styles['--tag_color'] && styles.has_tag,
						isDragging && styles.isDragging,
						month_mode && visible_detail && styles.visible_detail,
						...look.class
					)}
					style={{
						transform: month_mode ? 'unset' : CSS.Translate.toString(transform),
						...look.style,
						...tag_styles
					}}
					ref={setDragRef}
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
								data-placeholder='输入描述'
								onInput={onInput}
								onKeyDown={onKeyDown}
							></div>
						</div>
						{((!month_mode && item.length > 1) || timeline) && (
							<div className='time flex justify_between'>
								<div className='flex'>
									<span className='mr_4'>{time.time}</span>
									<span>{time.cross_time}</span>
								</div>
								{status &&
									(status === 'ok' ? (
										<Check weight='bold'></Check>
									) : (
										<span>{status}</span>
									))}
							</div>
						)}
					</div>
					{month_mode && status && (
						<span className='status flex justify_center align_center absolute'>{status}</span>
					)}
				</div>
			</Dropdown>
		</Popover>
	)
}

export default $app.memo(Index)
