import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'

import { hours } from '@/appdata/schedule'
import { useDroppable } from '@dnd-kit/core'

import { collisionDetection, getStartByY } from '../../utils'
import TimeBlock from '../TimeBlock'
import Signal from '../TimeBlock/Signal'
import styles from './index.css'

import type { IPropsCalendarViewDay } from '../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsCalendarViewDay) => {
	const {
		container,
		day_info,
		day,
		counts,
		index,
		tags,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props
	const { show } = useContextMenu({ id: 'timeblock_context_menu' })
	const [signal, setSignal] = useState<IPropsCalendarViewDay['move_item'] | null>(null)
	const { setNodeRef } = useDroppable({ id: index })

	const clearSignal = useMemoizedFn(v => {
		if (v === index) return

		setSignal(null)
	})

	useEffect(() => {
		if (!move_item) return setSignal(null)

		setSignal(move_item)
	}, [move_item])

	useEffect(() => {
		$app.Event.on('schedule/context_menu/hidden', clearSignal)

		return () => $app.Event.off('schedule/context_menu/hidden', clearSignal)
	}, [])

	const onContextMenu = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()

		$app.Event.emit('schedule/context_menu/hidden', index)

		let length = 3
		let overflow = false

		const start = getStartByY(container.current, e.clientY)!

		if (start + 3 >= 72) {
			length = 72 - start
			overflow = true
		}

		const target_length = collisionDetection(day, start, length)

		if (!target_length) return

		setSignal({ start, length: target_length } as IPropsCalendarViewDay['move_item'])
		show({ event: e, props: { index, start, length: target_length, overflow } })
	})

	return (
		<div
			className={$cx('day_wrap h_100 border_box relative', styles.Day, day_info.is_today && styles.today)}
			style={{ width: `calc(100% / ${counts})` }}
			onContextMenu={onContextMenu}
			ref={setNodeRef}
		>
			<div className='hours_wrap w_100 flex flex_column'>
				{hours.map(item => (
					<span
						className='hour_item w_100 border_box flex justify_center align_center'
						key={item}
					></span>
				))}
			</div>
			{signal && <Signal item={signal}></Signal>}
			{day.map((item, timeblock_index) => (
				<TimeBlock
					item={item}
					tags={tags}
					day_index={index}
					timeblock_index={timeblock_index}
					updateTimeBlock={updateTimeBlock}
					removeTimeBlock={removeTimeBlock}
					copyTimeBlock={copyTimeBlock}
					changeTimeBlockLength={changeTimeBlockLength}
					key={item.id}
				></TimeBlock>
			))}
		</div>
	)
}

export default $app.memo(Index)
