import { useMemoizedFn } from 'ahooks'
import { useContextMenu } from 'react-contexify'

import { ArrowRight } from '@phosphor-icons/react'

import DayExtra from '../DayExtra'
import TimeBlock from '../TimeBlock'
import styles from './index.css'

import type { IPropsMonthViewDay } from '../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsMonthViewDay) => {
	const { day_info, day, index, tags, fixed_view, updateTimeBlock, removeTimeBlock, copyTimeBlock, jump } = props
	const { show } = useContextMenu({ id: 'timeblock_context_menu' })

	const onJump = useMemoizedFn(() => jump(day_info.value))

	const onContextMenu = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()

		$app.Event.emit('schedule/context_menu/hidden', index)

		show({ event: e, props: { index, start: 0, length: 3 } })
	})

	return (
		<div
			className={$cx(
				'border_box',
				styles.Day,
				!fixed_view && styles.normal_view,
				!day_info.is_current_month && styles.not_current_month,
				day_info.is_today && styles.is_today
			)}
			onContextMenu={onContextMenu}
		>
			<div
				className={$cx(
					'w_100 border_box flex justify_between align_center relative',
					styles.header_wrap
				)}
			>
				<span className='date'>{day_info.date}</span>
				<div className={$cx('h_100 flex align_center', styles.extra_wrap)}>
					{day.length > 0 && (
						<span className='counts border_box flex justify_center align_center'>
							{day.length}
						</span>
					)}
					{!fixed_view && <DayExtra item={day_info}></DayExtra>}
				</div>
				{!fixed_view && (
					<div
						className={$cx(
							'none justify_center align_center border_box absolute top_0 right_0 cursor_point clickable',
							styles.btn_jump
						)}
						onClick={onJump}
					>
						<ArrowRight size={10}></ArrowRight>
					</div>
				)}
			</div>
			{day.length > 0 && (
				<div className={$cx('w_100 border_box', styles.timeblocks_wrap)}>
					<div className='w_100 flex flex_column'>
						{day.map((item, timeblock_index) => (
							<TimeBlock
								item={item}
								tags={tags}
								day_index={index}
								timeblock_index={timeblock_index}
								month_mode
								unpaid={false}
								updateTimeBlock={updateTimeBlock}
								removeTimeBlock={removeTimeBlock}
								copyTimeBlock={copyTimeBlock}
								key={item.id}
							></TimeBlock>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
