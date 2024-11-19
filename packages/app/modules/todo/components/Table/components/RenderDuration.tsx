import dayjs from 'dayjs'
import { useMemo } from 'react'

import styles from '../index.css'

import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent) => {
	const { deps } = props
	const { create_at, done_time } = deps

	const consuming_time = useMemo(() => {
		if (!done_time) return

		const diff_time = dayjs(done_time).diff(dayjs(create_at))

		return dayjs.duration(diff_time).humanize()
	}, [create_at, done_time])

	return (
		<div className={$cx('flex justify_center', styles.RenderCreateAt)}>
			<Choose>
				<When condition={Boolean(consuming_time)}>{consuming_time}</When>
				<Otherwise>-</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
