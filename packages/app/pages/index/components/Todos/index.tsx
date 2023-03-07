import TodoItem from '../TodoItem'
import styles from './index.css'

import type { IPropsTodos } from '../../types'

const Index = (props: IPropsTodos) => {
      const { todo_items } = props
      
	return (
		<div className={$cx('limited_content_wrap flex flex_column',styles._local)}>
			{todo_items.map((item) => (
				<TodoItem {...item} key={item.id}></TodoItem>
			))}
		</div>
	)
}

export default $app.memo(Index)
