import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { ArrowRight } from '@phosphor-icons/react'

import { useTagStyles } from '../../../TimeBlock/hooks'
import styles from './index.css'

import type { IPropsListItem } from '../../../../types'

const Index = (props: IPropsListItem) => {
	const { item, tags, jump } = props
	const { start_time, end_time } = item
	const tag_styles = useTagStyles(tags, item.tag)

	const { days, cross_time, duration } = useMemo(() => {
		const start = dayjs(start_time)
		const end = dayjs(end_time)
		const days = end.diff(start, 'hours') / 24

		return {
			days,
			cross_time: `${days}${$t('common.time.d')}`,
			duration: `${start.format('MM.DD')} - ${end.format('MM.DD')}`
		}
	}, [start_time, end_time])

	const onJump = useMemoizedFn(() => jump(item.id, dayjs(start_time), true))

	return (
		<div
			className={$cx(
				'timeblock w_100 border_box flex align_center relative',
				styles.timeline,
				!tag_styles['--tag_color'] && styles.no_tag
			)}
			style={{ ...tag_styles }}
		>
			<span className='dot'></span>
			<span className='text line_clamp_1'>{item.text ?? '---'}</span>
			<span className='days_wrap' style={{ '--percent': days / 12 }}></span>
			<span className='cross_time'>{cross_time}</span>
			<span className='duration'>{duration}</span>
			<div className='btn_jump none justify_center align_center absolute clickable' onClick={onJump}>
				<ArrowRight></ArrowRight>
			</div>
		</div>
	)
}

export default $app.memo(Index)
