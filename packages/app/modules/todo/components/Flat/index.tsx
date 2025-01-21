import { Plus } from '@phosphor-icons/react'

import FlatTodos from '../FlatTodos'
import styles from './index.css'

import type { IPropsKanban } from '../../types'

const Index = (props: IPropsKanban) => {
	const {
		mode,
		open_items,
		zen_mode,
		kanban_mode,
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
		<div className={$cx('h_100 border_box flex flex_column', styles._local)}>
			{Object.values(kanban_items).map((item, index) => (
				<div
					className={$cx('border_box flex flex_column', styles.kanban_item_wrap)}
					key={item.dimension.value.id}
				>
					<div className='kanban_item_header_wrap w_100 border_box'>
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
							<div
								className='btn_insert border_box flex justify_center align_center clickable'
								onClick={() =>
									insert({
										index: -1,
										dimension_id: Object.keys(kanban_items)[index]
									})
								}
							>
								<Plus size={15}></Plus>
							</div>
						</div>
					</div>
					<FlatTodos
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
						kanban_mode={mode === 'kanban' ? kanban_mode : undefined}
						items={item.items}
						dimension_id={Object.keys(kanban_items)[index]}
					></FlatTodos>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
