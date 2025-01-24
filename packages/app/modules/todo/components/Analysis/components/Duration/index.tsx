import { Segmented } from 'antd'

import styles from './index.css'

import type { IPropsAnalysisDuration } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisDuration) => {
	const {} = props

	return (
		<div className={$cx(styles._local)}>
			<Segmented
				className='w_100'
				options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']}
			></Segmented>
		</div>
	)
}

export default $app.memo(Index)
