import { Normal, ColorSelector } from './components'
import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<Normal></Normal>
			<ColorSelector></ColorSelector>
		</div>
	)
}

export default $app.memo(Index)
