import styles from './index.css'

import type { IPropsAnalysisList } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisList) => {
	const { unpaid, data } = props

	return (
		<div className={$cx('flex', styles._local, unpaid && styles.unpaid)}>
			<textarea className='w_100 h_100 border_box' value={data} disabled></textarea>
		</div>
	)
}

export default $app.memo(Index)
