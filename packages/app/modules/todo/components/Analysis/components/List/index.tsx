import styles from './index.css'

import type { IPropsAnalysisList } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisList) => {
	const { data } = props

	return (
		<div className={$cx('flex', styles._local)}>
			<textarea className='w_100 border_box' value={data + data + data} disabled></textarea>
		</div>
	)
}

export default $app.memo(Index)
