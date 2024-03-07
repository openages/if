import { useMemoizedFn } from 'ahooks'

import { ArrowRight } from '@phosphor-icons/react'

import DayExtra from '../DayExtra'
import TimeBlock from '../TimeBlock'
import styles from './index.css'

import type { IPropsMonthViewDay } from '../../types'

const Index = (props: IPropsMonthViewDay) => {
	const { day_info, day, index, tags, updateTimeBlock, removeTimeBlock, copyTimeBlock, jump } = props

	const onJump = useMemoizedFn(() => jump(day_info.value))

	return (
		<div
			className={$cx(
				'border_box',
				styles.Day,
				!day_info.is_current_month && styles.not_current_month,
				day_info.is_today && styles.is_today
			)}
		>
			<div
				className={$cx(
					'w_100 border_box flex justify_between align_center relative',
					styles.header_wrap
				)}
			>
				<div className='flex align_center'>
					<span className='date'>{day_info.date}</span>
					{day.length > 0 && (
						<span className='counts border_box flex justify_center align_center ml_6'>
							{day.length}
						</span>
					)}
				</div>
				<div className={styles.extra_wrap}>
					<DayExtra item={day_info}></DayExtra>
				</div>
				<div
					className={$cx(
						'none justify_center align_center border_box absolute top_0 right_0 cursor_point clickable',
						styles.btn_jump
					)}
					onClick={onJump}
				>
					<ArrowRight size={12}></ArrowRight>
				</div>
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
