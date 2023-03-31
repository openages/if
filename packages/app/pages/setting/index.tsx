import { ColorSelector, Normal } from './components'
import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx(styles._local, 'limited_unchanged_content_wrap border_box flex flex_column')}>
			<Normal></Normal>
			<ColorSelector></ColorSelector>
		</div>
	)
}

export default $app.memo(Index)
