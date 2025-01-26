import FlatLevel from '../FlatLevel'

import type { IPropsLevelStatus } from '../../types'

const Index = (props: IPropsLevelStatus) => {
	const { level } = props

	return (
		<div className={$cx('other_wrap border_box flex justify_center align_center')} style={{ marginRight: 0 }}>
			<FlatLevel as_label value={level}></FlatLevel>
		</div>
	)
}

export default $app.memo(Index)
