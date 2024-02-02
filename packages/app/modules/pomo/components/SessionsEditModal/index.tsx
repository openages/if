import { Drawer } from 'antd'

import styles from './index.css'
import Item from './Item'

import type { IPropsSessionsEditModal } from '../../types'

const Index = (props: IPropsSessionsEditModal) => {
	const { visible_edit_modal, data, add, update, remove, close } = props

	return (
		<Drawer
			rootClassName={$cx('useInPage', styles._local)}
			open={visible_edit_modal}
			mask={false}
			width={90}
			zIndex={100}
			destroyOnClose
			getContainer={false}
			onClose={close}
		>
			<div className='session_items w_100 border_box flex flex_column'>
				{data.sessions.map((item, index) => (
					<Item
						{...{ update, remove }}
						item={item}
						index={index}
						disabled={data.status && data.index === index}
						key={item.id}
					></Item>
				))}
			</div>
		</Drawer>
	)
}

export default $app.memo(Index)
