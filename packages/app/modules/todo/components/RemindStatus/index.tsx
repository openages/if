import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { format } from '@/utils/date'
import { Bell } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsRemindStatus } from '../../types'

const Index = (props: IPropsRemindStatus) => {
	const { remind_time } = props
	const [timeout, setTimeout] = useState(false)

	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date().valueOf()

			if (now >= remind_time) {
				setTimeout(true)

				clearInterval(timer)
			}
		}, 3000)

		return () => clearInterval(timer)
	}, [remind_time])

	return (
		<div className={$cx('other_wrap remind_wrap flex justify_center align_center', styles._local)}>
			<Bell
				className={$cx('icon', timeout && 'timeout')}
				size={10}
				weight={timeout ? 'duotone' : 'regular'}
			></Bell>
			{!timeout && <span className='text ml_2'>{format(dayjs(remind_time), true)}</span>}
		</div>
	)
}

export default $app.memo(Index)
