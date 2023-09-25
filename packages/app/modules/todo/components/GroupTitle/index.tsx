import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsGroupTitle } from '../../types'

const Index = ({ item, index }: IPropsGroupTitle) => {
	const { id, text } = item
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id,
		data: { index }
      })

	return (
		<div
			className={$cx('flex flex_column relative', styles._local)}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			<div
				className={$cx(
					'drag_wrap group border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10'
				)}
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
			</div>
			<span className='group_title'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
