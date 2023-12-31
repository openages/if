import { useMemo } from 'react'

import { getColorByLevel } from '@/appdata'
import { FireSimple } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsStarStatus } from '../../types'
const Index = (props: IPropsStarStatus) => {
	const { star } = props
	const color = getColorByLevel(star)

	return (
		<div
			className={$cx('other_wrap border_box flex justify_center align_center', styles._local)}
			style={{ color }}
		>
			<FireSimple fontSize={10} weight='fill'></FireSimple>
		</div>
	)
}

export default $app.memo(Index)
