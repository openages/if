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
		timeblock_index,
		month_mode,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props
	const [visible_detail, setVisibleDetail] = useState(false)
	const [status, setStatus] = useState('')
	const context_menu_items = useContextMenuItems()
	const { t } = useTranslation()
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
		data: { day_index, timeblock_index }
	})

	const { drag_ref } = useDragLength({
		type: 'timeblock',
		day_index,
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
	}, [month_mode])

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

	const onContextMenu = useMemoizedFn(({ key }) => {
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
	}, [item, month_mode])

	return (
		<Popover
			open={visible_detail}
			content={<TimeBlockDetail item={item} tags={tags} updateTimeBlock={updateTimeBlock} />}
			zIndex={100}
			overlayClassName={$cx('border_popover', month_mode && 'month_mode_timeblock_popover')}
			destroyTooltipOnHide
			placement={month_mode ? 'right' : 'rightTop'}
			getPopupContainer={month_mode ? () => document.body : null}
		>
			<Dropdown
				destroyPopupOnHide
				trigger={['contextMenu']}
				overlayStyle={{ width: 90 }}
				menu={{
					items: context_menu_items,
					onClick: onContextMenu
				}}
			>
				<div
					className={$cx(
						'timeblock_item_wrap w_100 border_box flex flex_column',
						styles._local,
						tag_styles['--tag_color'] && styles.has_tag,
						isDragging && styles.isDragging,
						...look.class
					)}
					style={{
						transform: month_mode ? 'unset' : CSS.Translate.toString(transform),
						...look.style,
						...tag_styles
					}}
					ref={setDragRef}
					{...attributes}
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
						<div className='text_scroll_wrap w_100'>
							<div
								className='text_wrap w_100 border_box'
								ref={input}
								contentEditable='plaintext-only'
								data-placeholder='输入描述'
								onInput={onInput}
								onKeyDown={onKeyDown}
							></div>
						</div>
						{!month_mode && item.length > 1 && (
							<div className='time flex justify_between'>
								<span>
									{dayjs(item.start_time).format('HH:mm')} -{' '}
									{dayjs(item.end_time).format('HH:mm')}
								</span>
								{status &&
									(status === 'ok' ? (
										<Check weight='bold'></Check>
									) : (
										<span>{status}</span>
									))}
							</div>
						)}
					</div>
				</div>
			</Dropdown>
		</Popover>
	)
}

export default $app.memo(Index)
