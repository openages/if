import { Plus } from '@phosphor-icons/react'
import Todos from '../Todos'
import styles from './index.css'

import type { IPropsKanban } from '../../types'

const Index = (props: IPropsKanban) => {
	const {
		kanban_mode,
		kanban_items,
		tags,
		angles,
		relations,
		drag_disabled,
		check,
		updateRelations,
		move,
		insert,
		update,
		tab,
		moveTo,
		remove,
		showDetailModal
	} = props

	return (
		<div className={$cx('h_100 border_box flex', styles._local, kanban_mode === 'tag' && styles.tag_mode)}>
			{Object.values(kanban_items).map(item => (
				<div
					className={$cx('border_box flex flex_column', styles.kanban_item_wrap)}
					key={item.dimension.value.id}
				>
					<div
						className={$cx(
							'w_100 border_box flex justify_between align_center relative',
							styles.kanban_item_header
						)}
						style={
							item.dimension.type === 'tag'
								? // @ts-ignore
								  { '--color_tag': item.dimension.value.color }
								: {}
						}
					>
						<div className='left_wrap flex align_center'>
							<span className='name'>{item.dimension.value.text}</span>
							{item.items.length > 0 && (
								<span className='count ml_6'>{item.items.length}</span>
							)}
						</div>
						{!item.items.length && (
							<span className='btn_insert flex justify_center align_center clickable'>
								<Plus size={16}></Plus>
							</span>
						)}
					</div>
					<Todos
						{...{
							tags,
							angles,
							relations,
							drag_disabled,
							check,
							updateRelations,
							move,
							insert,
							update,
							tab,
							moveTo,
							remove,
							showDetailModal
						}}
						items={item.items}
						kanban_mode
					></Todos>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
