import styles from './index.css'

const Index = () => {
	return <div className={$cx(styles._local)}></div>
}

export default $app.memo(Index)
