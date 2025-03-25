import { bgs } from '../../model'
import styles from './index.css'

import type { IPropsBg } from '../../types'

const Index = (props: IPropsBg) => {
	const { bg_index } = props

	return (
		<div className={$cx('w_100 h_100 absolute top_0 left_0', styles._local)}>
			<div className='bg w_100 h_100 absolute' style={{ backgroundImage: `url(${bgs[bg_index]})` }}></div>
			<div className='mask w_100 h_100 absolute'></div>
		</div>
	)
}

export default $app.memo(Index)
