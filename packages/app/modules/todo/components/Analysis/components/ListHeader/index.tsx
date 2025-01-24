import styles from './index.css'

import type { IPropsAnalysisListHeader } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisListHeader) => {
	const {} = props

	return <div className={$cx(styles._local)}></div>
}

export default $app.memo(Index)
