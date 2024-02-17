import { Popover } from 'antd'

import { Plus } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	return (
		<Popover trigger='click' content={<div>123</div>}>
			<div className={$cx('absolute', styles._local)}>
				<div className={$cx('btn_add border_box flex justify_center align_center clickable')}>
					<Plus weight='bold'></Plus>
				</div>
			</div>
		</Popover>
	)
}

export default $app.memo(Index)
