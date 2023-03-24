import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import styles from '../index.css'

import type { IPropsDirItem_SortableWrap } from '../../../types'

const Index = (props: IPropsDirItem_SortableWrap) => {
	const { children, id } = props
	const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id })

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column relative',
				styles._local,
				isDragging && styles.isDragging
			)}
			{...listeners}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			{children}
		</div>
	)
}

export default $app.memo(Index)
