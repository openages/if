import { CurrentSelect, Filter, ViewSelect } from './components'
import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 border_box flex justify_center align_center relative', styles._local)}>
			<ViewSelect></ViewSelect>
			<CurrentSelect></CurrentSelect>
			<Filter></Filter>
		</div>
	)
}

export default $app.memo(Index)
