import { ColorSelector, Normal } from './components'
import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx(styles._local, 'w_100 border_box flex flex_column')}>
			<Normal></Normal>
			<ColorSelector></ColorSelector>
		</div>
	)
}

export default $app.memo(Index)
