import styles from './index.css'

import type { IPropsAnalysisList } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisList) => {
	const {} = props

	return <div className={$cx(styles._local)}></div>
}

export default $app.memo(Index)
