import { Backup, ColorSelector, Normal, Screenlock, Tray, Update } from './components'
import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<Normal></Normal>
			<ColorSelector></ColorSelector>
			<Tray></Tray>
			<Screenlock></Screenlock>
			<Backup></Backup>
			<Update></Update>
		</div>
	)
}

export default $app.memo(Index)
