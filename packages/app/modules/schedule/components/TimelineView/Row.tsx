import styles from './index.css'

const Index = () => {
	return <div className={$cx('timeline_row', styles.Row)}></div>
}

export default $app.memo(Index)
