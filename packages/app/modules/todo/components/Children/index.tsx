import { useMemoizedFn } from 'ahooks'

import { Todo } from '@/types'
import { id } from '@/utils'

import styles from './index.css'
import Item from './Item'

import type { IPropsChildren } from '../../types'

const Index = (props: IPropsChildren) => {
	const { items, index, fold, handled, update: updateChildren, tab } = props

	const update = useMemoizedFn(
		async (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => {
			const children = [...items]

			children[children_index] = { ...children[children_index], ...value }

			await updateChildren({ type: 'children', index, value: children })
		}
	)

	const insert = useMemoizedFn(async (children_index: number) => {
		const children = [...items]

		children.splice(children_index + 1, 0, {
			id: id(),
			text: '',
			status: 'unchecked'
		})

		await updateChildren({ type: 'children', index, value: children })
	})

	return (
		<div className={$cx('w_100 border_box', styles._local, handled && styles.handled)}>
			<div className='children_wrap w_100 border_box flex flex_column'>
				{items.map((item, children_index) => (
					<Item {...{ item, index, children_index, insert, update, tab }} key={item.id}></Item>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
