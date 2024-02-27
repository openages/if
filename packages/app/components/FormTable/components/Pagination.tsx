import styles from '../index.css'

import type { IPropsPagination } from '../types'

const Index = (props: IPropsPagination) => {
	const {} = props

	return <div className={$cx(styles.Pagination)}></div>
}

export default $app.memo(Index)
