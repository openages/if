import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useTagStyles } from '@/modules/schedule/components/TimeBlock/hooks'
import { ArrowRight } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsItem } from '../../types'

const Index = (props: IPropsItem) => {
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

	const onJump = useMemoizedFn(() => jump?.(item.id, dayjs(start_time), true))

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
			<If condition={Boolean(jump)}>
				<div className='btn_jump none justify_center align_center absolute clickable' onClick={onJump}>
					<ArrowRight></ArrowRight>
				</div>
			</If>
		</div>
	)
}

export default $app.memo(Index)
