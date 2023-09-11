import styles from './index.css'

import type { IPropsGroupTitle } from '../../types'

const Index = ({ item }: IPropsGroupTitle) => {
	return (
		<div className={$cx('flex flex_column', styles._local)}>
			<span className='group_title'>{item.text}</span>
		</div>
	)
}

export default $app.memo(Index)
