import styles from './index.css'

const Index = () => {
	return <div className={$cx('border_box', styles._local)}></div>
}

export default $app.memo(Index)
