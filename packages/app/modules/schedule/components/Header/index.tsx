import { Center, Left, Right } from './components'
import styles from './index.css'

import type { IPropsHeader, IPropsHeaderCenter, IPropsHeaderLeft, IPropsHeaderRight } from '../../types'

const Index = (props: IPropsHeader) => {
	const {
		view,
		scale,
		current,
		visible_task_panel,
		tags,
		filter_tags,
		step,
		toggleVisibleTaskPanel,
		changeView,
		changeScale,
		showSettingsModal,
		changeFilterTags
	} = props

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

	const props_right: IPropsHeaderRight = {
		tags,
		filter_tags,
		showSettingsModal,
		changeFilterTags
	}

	return (
		<div className={$cx('w_100 border_box flex justify_center align_center relative', styles._local)}>
			<Left {...props_left}></Left>
			<Center {...props_center}></Center>
			<Right {...props_right}></Right>
		</div>
	)
}

export default $app.memo(Index)
