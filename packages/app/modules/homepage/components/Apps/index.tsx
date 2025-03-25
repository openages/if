import styles from './index.css'
import Item from './Item'

import type { IPropsApps } from '../../types'

const Index = (props: IPropsApps) => {
	const { id, apps } = props

	return (
		<div className={$cx('w_100 border_box relative', styles._local, id && styles.as_tab)}>
			<div className='app_items w_100 h_100 border_box flex flex_wrap'>
				{apps.map(item => (
					<Item item={item} key={item.id}></Item>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
