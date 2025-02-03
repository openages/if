import { useRef } from 'react'

import FlatTodos from '../FlatTodos'
import styles from './index.css'

import type { IPropsKanban } from '../../types'

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
	const scroll_container = useRef<HTMLDivElement>(null)

	return (
		<div className={$cx('border_box flex flex_column', styles._local)} ref={scroll_container}>
			{Object.values(kanban_items).map(item => (
				<div
					className={$cx('border_box flex flex_column', styles.kanban_item_wrap)}
					key={item.dimension.value.id}
				>
					<FlatTodos
						{...{
							scroll_container,
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
						dimension_id={item.dimension.value.id}
						angle={item.dimension.value}
					></FlatTodos>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
