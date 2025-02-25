import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { useCreateEffect } from '@/hooks'
import { format } from '@/utils/date'
import { Bell } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsRemindStatus } from '../../types'

const Index = (props: IPropsRemindStatus) => {
	const { remind_time, useByFlat } = props
	const [timeout, setTimeout] = useState(false)

	useCreateEffect(() => {
		const timer = setInterval(() => {
			const now = new Date().valueOf()

			if (now >= remind_time!) {
				setTimeout(true)

				clearInterval(timer)
			}
		}, 3000)

		return () => clearInterval(timer)
	}, [remind_time])

	const status = useMemo(() => {
		if (!remind_time) return
		if (dayjs(remind_time).valueOf() < new Date().valueOf()) return 'timeout'
		if (dayjs(remind_time).diff(dayjs(), 'hour') <= 12) return 'close'
	}, [remind_time])

	return (
		<div
			className={$cx(
				'other_wrap remind_wrap flex justify_center align_center',
				styles._local,
				useByFlat && styles.useByFlat,
				(status === 'timeout' || status === 'close') && styles.notify
			)}
		>
			<Bell
				className={$cx('icon', timeout && 'timeout')}
				size={useByFlat ? 12 : 10}
				weight={timeout ? 'fill' : 'regular'}
			></Bell>
			<span className={$cx('text', useByFlat ? 'ml_4' : 'ml_2')}>{format(dayjs(remind_time), true)}</span>
		</div>
	)
}

export default $app.memo(Index)
