import styles from './index.css'

const Index = () => {
	return <div className={$cx('absolute', styles._local)}>Show your minds</div>
}

export default $app.memo(Index)
