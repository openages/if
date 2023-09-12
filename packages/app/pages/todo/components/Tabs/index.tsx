import { ScrollMenu } from 'react-horizontal-scrolling-menu'

import { onWheel } from '@/utils'

import styles from './index.css'
import Item from './Item'

import type { IPropsTabs } from '../../types'

const Index = (props: IPropsTabs) => {
	const { angles, current_angle_id, setCurrentAngleId } = props

	return (
		<div className={$cx('w_100 border_box sticky', styles._local)}>
			<div className='tabs_wrap limited_content_wrap flex align_center relative'>
				<div className='tab_items_wrap w_100 relative'>
					<ScrollMenu onWheel={onWheel}>
						{angles.map((item) => (
							<Item
								is_active={item.id === current_angle_id}
								key={item.id}
								{...{ item, setCurrentAngleId }}
							></Item>
						))}
					</ScrollMenu>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
