import Input from '../Input'
import Todos from '../Todos'
import styles from './index.css'

import type { IPropsKanban } from '../../types'

const Index = (props: IPropsKanban) => {
	const {
		kanbans,
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
		<div className={$cx('h_100 border_box flex', styles._local)}>
			{Object.values(kanbans).map(item => (
				<div
					className={$cx('border_box flex flex_column', styles.kanban_item_wrap)}
					key={item.angle.id}
				>
					<div
						className={$cx(
							'w_100 border_box flex justify_between align_center',
							styles.kanban_item_header
						)}
					>
						<span className='angle'>{item.angle.text}</span>
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
