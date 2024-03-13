import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'

import { collisionDetection, getStartByX } from '../../utils'
import Signal from '../TimeBlock/Signal'
import styles from './index.css'

import type { IPropsTimelineViewRow } from '../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsTimelineViewRow) => {
	const { container, step, days_length, angle_index, row_index, angle_id, row_id, timeblocks } = props
	const [signal, setSignal] = useState(null)
	const { show } = useContextMenu({ id: 'timeblock_context_menu' })

	const clearSignal = useMemoizedFn(v => {
		if (v === row_id) return

		setSignal(null)
	})

	useEffect(() => {
		$app.Event.on('schedule/context_menu/hidden', clearSignal)

		return () => $app.Event.off('schedule/context_menu/hidden', clearSignal)
	}, [])

	const onContextMenu = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()

		$app.Event.emit('schedule/context_menu/hidden', row_id)

		const start = getStartByX(container.current, step, e.clientX)
		const length = start + 2 >= days_length * 2 ? days_length * 2 - start : 2

		const target_length = collisionDetection(timeblocks, start, length)

		if (!target_length) return

		setSignal({ start, length: target_length })
		show({ event: e, props: { index: angle_index, row_index, start, length: target_length } })
	})

	return (
		<div className={$cx('timeline_row relative', styles.Row)} onContextMenu={onContextMenu}>
			{signal && <Signal item={signal} step={step} timeline></Signal>}
		</div>
	)
}

export default $app.memo(Index)
