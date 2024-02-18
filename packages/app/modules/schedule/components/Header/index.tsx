import { Center, Filter, Left } from './components'
import styles from './index.css'

import type { IPropsHeader, IPropsHeaderCenter } from '../../types'

const Index = (props: IPropsHeader) => {
	const { view, scale, current, visible_task_panel, step } = props

	const props_center: IPropsHeaderCenter = {
		current,
		step
	}

	return (
		<div className={$cx('w_100 border_box flex justify_center align_center relative', styles._local)}>
			<Left></Left>
			<Center {...props_center}></Center>
			<Filter></Filter>
		</div>
	)
}

export default $app.memo(Index)
