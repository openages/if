import Color from 'color'
import { xxHash32 } from 'js-xxhash'
import genColor from 'uniqolor'

import { Plus } from '@phosphor-icons/react'

import Todos from '../Todos'
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
		<div className={$cx('h_100 border_box flex', styles._local, kanban_mode === 'tag' && styles.tag_mode)}>
			{Object.values(kanban_items).map((item, index) => (
				<div
					className={$cx('border_box flex flex_column', styles.kanban_item_wrap)}
					key={item.dimension.value.id}
					style={{
						'--color_kanban_column': Color(
							genColor(xxHash32(item.dimension.value.id).toString(3), {
								saturation: 90,
								lightness: 72
							}).color
						)
							.rgb()
							.array()
							.join(',')
					}}
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
						kanban_mode={kanban_mode}
						items={item.items}
						dimension_id={Object.keys(kanban_items)[index]}
					></Todos>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
