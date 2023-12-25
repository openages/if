import { Plus } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
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
		insert,
		update,
		tab,
		moveTo,
		remove,
		showDetailModal
	} = props
	const { t } = useTranslation()

	return (
		<div className={$cx('h_100 border_box flex', styles._local, kanban_mode === 'tag' && styles.tag_mode)}>
			{Object.values(kanban_items).map((item, index) => (
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
					</div>
					{!item.items.length && (
						<div
							className={$cx('border_box', styles.btn_insert_wrap)}
							onClick={() =>
								insert({ index: -1, dimension_id: Object.keys(kanban_items)[index] })
							}
						>
							<div className='btn_insert w_100 h_100 border_box flex justify_center align_center clickable'>
								<Plus size={15}></Plus>
								<span className='text ml_6'>
									{t('translation:todo.Input.placeholder')}
								</span>
							</div>
						</div>
					)}
					<Todos
						{...{
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
