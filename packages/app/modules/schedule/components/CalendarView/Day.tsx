import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'

import { hours } from '@/appdata/schedule'

import { collisionDetection, getStartByY } from '../../utils'
import TimeBlock from '../TimeBlock'
import Signal from '../TimeBlock/Signal'
import styles from './index.css'

import type { IPropsCalendarViewDay } from '../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsCalendarViewDay) => {
	const {
		container,
		day,
		counts,
		index,
		tags,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		updateTodoSchedule
	} = props
	const { show } = useContextMenu({ id: 'timeblock_context_menu' })
	const [signal, setSignal] = useState(null)

	const clearSignal = useMemoizedFn(v => {
		if (v === index) return

		setSignal(null)
	})

	useEffect(() => {
		$app.Event.on('schedule/context_menu/hidden', clearSignal)

		return () => $app.Event.off('schedule/context_menu/hidden', clearSignal)
	}, [])

	const onContextMenu = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()

		$app.Event.emit('schedule/context_menu/hidden', index)

		const start = getStartByY(container, e.clientY)
		const length = start + 3 >= 72 ? 72 - start : 3

		const target_length = collisionDetection(day, start, length)

		if (!target_length) return

		setSignal({ start, length: target_length })
		show({ event: e, props: { index, start, length: target_length } })
	})

	return (
		<div
			className={$cx('day_wrap border_box relative', styles.Day)}
			style={{ width: `calc(100% / ${counts})` }}
			onContextMenu={onContextMenu}
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
			{day.map(item => (
				<TimeBlock
					item={item}
					tags={tags}
					updateTimeBlock={updateTimeBlock}
					removeTimeBlock={removeTimeBlock}
					copyTimeBlock={copyTimeBlock}
					updateTodoSchedule={updateTodoSchedule}
					key={item.id}
				></TimeBlock>
			))}
		</div>
	)
}

export default $app.memo(Index)
