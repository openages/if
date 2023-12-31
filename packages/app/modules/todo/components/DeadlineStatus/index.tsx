import dayjs from 'dayjs'

import { format } from '@/utils/date'
import { Calendar } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsDeadlineStatus } from '../../types'

const Index = (props: IPropsDeadlineStatus) => {
	const { end_time } = props
	const outdate = new Date().valueOf() >= dayjs(end_time).valueOf()
	const text = format(dayjs(end_time), true)

	return (
		<div className={$cx('other_wrap border_box flex justify_center align_center', outdate && styles.outdate)}>
			<Calendar size={10} weight={outdate ? 'fill' : 'regular'}></Calendar>
			{text && <span className='text ml_2'>{text}</span>}
		</div>
	)
}

export default $app.memo(Index)
