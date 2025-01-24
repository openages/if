import styles from './index.css'

import type { IPropsAnalysisExport } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisExport) => {
	const {} = props

	return <div className={$cx(styles._local)}></div>
}

export default $app.memo(Index)
