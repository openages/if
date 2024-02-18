import { Center, Filter, Left } from './components'
import styles from './index.css'

import type { IPropsHeader, IPropsHeaderCenter, IPropsHeaderLeft } from '../../types'

const Index = (props: IPropsHeader) => {
	const { view, scale, current, visible_task_panel, step, toggleVisibleTaskPanel, changeView, changeScale } = props

	const props_left: IPropsHeaderLeft = {
		view,
		scale,
		visible_task_panel,
		toggleVisibleTaskPanel,
		changeView,
		changeScale
	}

	const props_center: IPropsHeaderCenter = {
		current,
		step
	}

	return (
		<div className={$cx('w_100 border_box flex justify_center align_center relative', styles._local)}>
			<Left {...props_left}></Left>
			<Center {...props_center}></Center>
			<Filter></Filter>
		</div>
	)
}

export default $app.memo(Index)
