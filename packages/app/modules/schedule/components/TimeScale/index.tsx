import dayjs from 'dayjs'

import { hours } from '@/appdata/schedule'

import styles from './index.css'

const getStyle = (v: number) => {
	if (v >= 0 && v <= 8) {
		return (8 - v) / 8
	}

	if (v >= 16 && v <= 24) {
		return 1 - (24 - v) / 8
	}

	return 0
}

const Index = () => {
	return (
		<div className={$cx(styles._local)}>
			<div className='hours_wrap w_100 flex flex_column'>
				{hours.map(item => (
					<div
						className='hour_item w_100 border_box flex justify_center align_center relative'
						style={{ backgroundColor: `rgba(var(--color_text_rgb),${getStyle(item) / 4})` }}
						key={item}
					>
						{dayjs().hour(item).format('H')}
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
