import { useMemoizedFn } from 'ahooks'
import { Dropdown, Popover } from 'antd'
import Color from 'color'
import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDeepEffect } from '@/hooks'
import { useInput } from '@/modules/todo/hooks'
import { getDocItemsData } from '@/utils'
import { Check, Info, X } from '@phosphor-icons/react'

import { useDragLength } from '../../hooks'
import TimeBlockDetail from '../TimeBlockDetail'
import { useContextMenuItems } from './hooks'
import styles from './index.css'

import type { IPropsCalendarViewTimeBlock } from '../../types'
import type { Subscription } from 'rxjs'
import type { Todo } from '@/types'
import type { MenuProps } from 'antd'

const Index = (props: IPropsCalendarViewTimeBlock) => {
	const {
		item,
		tags,
		day_index,
		timeblock_index,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		updateTodoSchedule,
		changeTimeBlockLength
	} = props
	const [visible_detail, setVisibleDetail] = useState(false)
	const [status, setStatus] = useState('')
	const context_menu_items = useContextMenuItems()
	const { t } = useTranslation()

	const { drag_ref, changing } = useDragLength({
		type: 'timeblock',
		day_index,
		timeblock_index,
		changeTimeBlockLength
	})

	useLayoutEffect(() => () => setVisibleDetail(false), [])

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

	return (
		<Popover
			open={visible_detail}
			content={
				<TimeBlockDetail
					item={item}
					tags={tags}
					updateTimeBlock={updateTimeBlock}
					updateTodoSchedule={updateTodoSchedule}
				/>
			}
			zIndex={100}
			overlayClassName='border_popover'
			destroyTooltipOnHide
			fresh
			placement='rightTop'
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
						'w_100 border_box absolute top_0 flex flex_column',
						styles._local,
						item.length === 1 && styles.small,
						item.length === 2 && styles.middle,
						item.length === 3 && styles.large,
						item.length > 3 && styles.xlarge,
						tag_styles['--tag_color'] && styles.has_tag,
						changing && styles.changing
					)}
					style={{
						transform: `translateY(${item.start * 16}px)`,
						height: item.length * 16,
						...tag_styles
					}}
				>
					<div className='drag_line w_100 absolute bottom_0 right_0' ref={drag_ref}></div>
					<div
						className={$cx(
							'btn_detail none justify_center align_center absolute clickable',
							visible_detail && 'visible_detail'
						)}
						onClick={toggleVisibleDetail}
					>
						{visible_detail ? <X size={12}></X> : <Info size={14}></Info>}
					</div>
					<div className='timeblock_content_wrap w_100 h_100 border_box flex flex_column absolute top_0 left_0'>
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
						{item.length > 1 && (
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
