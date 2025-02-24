import { useMemoizedFn } from 'ahooks'
import { Progress } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { getCrossTime } from '@/modules/schedule/utils'
import { ArrowRight } from '@phosphor-icons/react'

import { useTagStyles } from '../../../TimeBlock/hooks'
import styles from './index.css'

import type { IPropsListItem } from '../../../../types'

const Index = (props: IPropsListItem) => {
	const { item, tags, jump } = props
	const { start_time, end_time } = item
	const tag_styles = useTagStyles(tags, item.tag)

	const { cross_time, duration } = useMemo(() => {
		const start = dayjs(start_time)
		const end = dayjs(end_time)
		const cross_time = getCrossTime(start, end)

		return {
			cross_time,
			duration: `${start.format('MM-DD HH:mm')} - ${end.format('HH:mm')}`
		}
	}, [start_time, end_time])

	const onJump = useMemoizedFn(() => jump(dayjs(start_time)))

	return (
		<div
			className={$cx(
				'timeblock w_100 border_box flex align_center relative',
				styles.calendar,
				!tag_styles['--tag_color'] && styles.no_tag
			)}
			style={{ ...tag_styles }}
		>
			<span className='tag_mark'></span>
			<div className='flex flex_column'>
				<span className='text line_clamp_1'>{item.text ?? '---'}</span>
				<div className='cross_wrap flex align_center'>
					<span className='duration'>{duration}</span>
					<span className='cross_time'>{cross_time}</span>
					<span
						className='hours_wrap'
						style={{ '--percent': parseFloat(cross_time.replace('h', '')) / 1 }}
					></span>
				</div>
			</div>
			<div className='btn_jump none justify_center align_center absolute clickable' onClick={onJump}>
				<ArrowRight></ArrowRight>
			</div>
		</div>
	)
}

export default $app.memo(Index)
