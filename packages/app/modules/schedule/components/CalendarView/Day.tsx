import { useMemoizedFn } from 'ahooks'
import { useContextMenu } from 'react-contexify'

import { hours } from '@/appdata/schedule'

import styles from './index.css'

import type { IPropsCalendarViewDay } from '../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsCalendarViewDay) => {
	const { day, counts, index } = props
	const { show } = useContextMenu({ id: 'timeblock_context_menu' })

	const onContextMenu = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()

		show({ event: e, props: { index, y: e.clientY } })
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
			{/* {day.map((item, index) => (
				<div
					className='time_block w_100 border_box absolute top_0'
					key={index}
					style={{ transform: `translateY(${item.start * 16}px)`, height: item.length * 16 }}
				></div>
			))} */}
		</div>
	)
}

export default $app.memo(Index)
