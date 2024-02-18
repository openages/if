import { hours } from '@/appdata/schedule'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx(styles._local)}>
			<div className='hours_wrap w_100 flex flex_column'>
				{hours.map(item => (
					<span className='hour_item w_100 border_box flex justify_center align_center' key={item}>
						{item}
					</span>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
