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
		changeCurrent,
		showSettingsModal,
		changeFilterTags
	} = props

	const props_left: IPropsHeaderLeft = {
		visible_task_panel,
		toggleVisibleTaskPanel
	}

	const props_center: IPropsHeaderCenter = {
		scale,
		current,
		step,
		changeCurrent
	}

	const props_right: IPropsHeaderRight = {
		view,
		scale,
		tags,
		filter_tags,
		changeView,
		changeScale,
		showSettingsModal,
		changeFilterTags
	}

	return (
		<div className={$cx('w_100 border_box flex justify_center align_center relative', styles._local)}>
			<Left {...props_left}></Left>
			{view !== 'fixed' && <Center {...props_center}></Center>}
			<Right {...props_right}></Right>
		</div>
	)
}

export default $app.memo(Index)
