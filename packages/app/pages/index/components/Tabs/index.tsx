import styles from './index.css'

import type { IPropsTabs } from '../../types'

const Index = (props: IPropsTabs) => {
	const { angles, angle_index, setCurrentAngle } = props

	return (
		<div className={$cx('w_100 border_box sticky', styles._local)}>
			<div className='tabs_wrap limited_content_wrap flex align_center relative'>
				<div className='tab_items_wrap w_100 flex'>
					{angles.map((item, index) => (
						<div
							className={$cx(
								'tab_item_wrap border_box flex justify_center align_center cursor_point clickable',
								angle_index === index && 'active'
							)}
							onMouseDown={() => setCurrentAngle(index)}
							key={item.id}
						>
							<span className='tab_name transition_normal'>{item.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
