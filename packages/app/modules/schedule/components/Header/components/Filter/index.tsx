import { Funnel } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('absolute', styles._local)}>
			<button className='btn_filter flex justify_center align_center clickable'>
				<Funnel></Funnel>
			</button>
		</div>
	)
}

export default $app.memo(Index)
