import TodoItem from '../TodoItem'
import styles from './index.css'

import type { IPropsTodos } from '../../types'

const Index = (props: IPropsTodos) => {
	const { items } = props

	return (
		<div className={$cx('limited_content_wrap flex flex_column', styles._local)}>
			{items.map((item, index) => (
				<TodoItem {...item} key={index}></TodoItem>
			))}
		</div>
	)
}

export default $app.memo(Index)
