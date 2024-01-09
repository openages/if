import styles from './index.css'

import type { IPropsFreeMark } from '../../types'

const Index = (props: IPropsFreeMark) => {
	const { user_type } = props

	if (user_type !== 'free') return null

	return (
		<div className={$cx('fixed flex flex_column cursor_point', styles._local)}>
			<span className={styles.title}>FREE VERSION</span>
			<span className={styles.desc}>Go to subscribe for professionals</span>
		</div>
	)
}

export default $app.memo(Index)
