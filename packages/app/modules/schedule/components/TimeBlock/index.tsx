import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'

import { useInput } from '@/modules/todo/hooks'
import { Info } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCalendarViewTimeBlock } from '../../types'

const Index = (props: IPropsCalendarViewTimeBlock) => {
	const { item, signal, updateTimeBlock } = props

	if (signal) {
		return (
			<div
				className={$cx(
					'w_100 border_box absolute top_0 flex flex_column',
					styles._local,
					styles.signal
				)}
				style={{ transform: `translateY(${item.start * 16}px)`, height: item.length * 16 }}
			></div>
		)
	}

	const { input, onInput } = useInput({
		value: item.text,
		max_length: 60,
		update: useMemoizedFn(textContent => updateTimeBlock(item.id, { text: textContent }))
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter' || e.key === 'Tab') {
			e.preventDefault()
		}
	})

	return (
		<div
			className={$cx(
				'w_100 border_box absolute top_0 flex flex_column',
				styles._local,
				item.length === 1 && styles.small,
				item.length === 2 && styles.middle,
				item.length === 3 && styles.large,
				item.length > 3 && styles.xlarge
			)}
			style={{ transform: `translateY(${item.start * 16}px)`, height: item.length * 16 }}
		>
			<div className='btn_detail none justify_center align_center absolute top_0 right_0 clickable'>
				<Info size={14}></Info>
			</div>
			<div className='text_scroll_wrap w_100'>
				<div
					className='text_wrap w_100 border_box'
					ref={input}
					contentEditable='plaintext-only'
					data-placeholder='输入标题'
					onInput={onInput}
					onKeyDown={onKeyDown}
				></div>
			</div>
			{item.length > 1 && (
				<span className='time'>
					{dayjs(item.start_time).format('HH:mm')} - {dayjs(item.end_time).format('HH:mm')}
				</span>
			)}
		</div>
	)
}

export default $app.memo(Index)
