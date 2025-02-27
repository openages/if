import styles from './index.css'

const Index = () => {
	return <div className={$cx('w_100 h_100', styles._local)}>123</div>
}

export default $app.memo(Index)
