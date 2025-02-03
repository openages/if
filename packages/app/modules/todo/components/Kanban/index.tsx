import FlatAngleHeader from '../FlatAngleHeader'
import Todos from '../Todos'
import styles from './index.css'

import type { IPropsKanban } from '../../types'
import type { Todo } from '@/types'

const Index = (props: IPropsKanban) => {
	const {
		mode,
		open_items,
		zen_mode,
		kanban_items,
		tags,
		angles,
		relations,
		drag_disabled,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props

	return (
		<div className={$cx('h_100 border_box flex', styles._local, mode === 'quad' && styles.quad)}>
			{Object.values(kanban_items).map((item, index) => {
				const items = item.items

				const percent =
					(items.filter(item => (item as Todo.Todo).status !== 'unchecked').length * 100) /
					items.length

				return (
					<div
						className={$cx('border_box flex flex_column', styles.kanban_item_wrap)}
						key={item.dimension.value.id}
					>
						<FlatAngleHeader
							useByKanban
							angle={item.dimension.value}
							dimension_id={item.dimension.value.id}
							counts={items.length}
							percent={percent}
							insert={insert}
						></FlatAngleHeader>
						<Todos
							{...{
								mode,
								tags,
								angles,
								relations,
								drag_disabled,
								open_items,
								zen_mode,
								check,
								updateRelations,
								insert,
								update,
								tab,
								moveTo,
								remove,
								handleOpenItem,
								showDetailModal
							}}
							items={item.items}
							dimension_id={Object.keys(kanban_items)[index]}
						></Todos>
					</div>
				)
			})}
		</div>
	)
}

export default $app.memo(Index)
