import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'

import { useDroppable } from '@dnd-kit/core'

import { collisionDetection, getStartByX } from '../../utils'
import TimeBlock from '../TimeBlock'
import Signal from '../TimeBlock/Signal'

import type { IPropsTimelineViewRow } from '../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsTimelineViewRow) => {
	const {
		unpaid,
		container,
		tags,
		step,
		days_length,
		angle_index,
		row_index,
		angle_id,
		row_id,
		timeblocks,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props
	const [signal, setSignal] = useState<IPropsTimelineViewRow['move_item'] | null>(null)
	const { show } = useContextMenu({ id: 'timeblock_context_menu' })
	const { setNodeRef } = useDroppable({ id: row_id, data: { step, angle_index, row_index, angle_id, row_id } })

	const clearSignal = useMemoizedFn(v => {
		if (v === row_id) return

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

		$app.Event.emit('schedule/context_menu/hidden', row_id)

		const limit = 2

		let length = limit
		let overflow = false

		const start = getStartByX(container.current!, step, e.clientX)!

		if (start + limit >= days_length) {
			length = days_length - start
			overflow = true
		}

		const target_length = collisionDetection(timeblocks, start, length)

		if (!target_length) return

		setSignal({ start, length: target_length } as IPropsTimelineViewRow['move_item'])

		show({ event: e, props: { index: angle_index, row_index, start, length: target_length, overflow } })
	})

	return (
		<div className='timeline_row relative' onContextMenu={onContextMenu} ref={setNodeRef}>
			{signal && <Signal item={signal} step={step} timeline></Signal>}
			{timeblocks.map((item, timeblock_index) => (
				<TimeBlock
					unpaid={unpaid}
					item={item}
					tags={tags}
					angle_row_id={row_id}
					timeblock_index={timeblock_index}
					step={step}
					dnd_data={{ step, angle_index, row_index, angle_id, row_id }}
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
