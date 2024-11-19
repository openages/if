import { getColorByLevel } from '@/appdata'
import { FireSimple } from '@phosphor-icons/react'

import type { IPropsLevelStatus } from '../../types'

const Index = (props: IPropsLevelStatus) => {
	const { level } = props
	const color = getColorByLevel(level!)

	return (
		<div
			className={$cx('other_wrap border_box flex justify_center align_center')}
			style={{ color, marginRight: 6 }}
		>
			<FireSimple fontSize={12} weight='fill'></FireSimple>
		</div>
	)
}

export default $app.memo(Index)
