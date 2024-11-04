import { is_mas_id } from '@/utils'

import { Backup, ColorSelector, Normal, Screenlock, Update } from './components'
import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<Normal></Normal>
			<ColorSelector></ColorSelector>
			<Screenlock></Screenlock>
			<Backup></Backup>
			<If condition={!is_mas_id}>
				<Update></Update>
			</If>
		</div>
	)
}

export default $app.memo(Index)
