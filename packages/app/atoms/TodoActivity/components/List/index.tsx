import styles from './index.css'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const { data_items } = props

	return <div className={$cx(styles._local)}></div>
}

export default $app.memo(Index)
