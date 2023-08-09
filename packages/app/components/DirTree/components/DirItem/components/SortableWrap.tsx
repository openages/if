import { useDroppable } from '@dnd-kit/core'

import styles from '../index.css'

import type { IPropsDirItem_SortableWrap } from '../../../types'

const Index = (props: IPropsDirItem_SortableWrap) => {
	const { children, item, parent_index } = props
	const { isOver, setNodeRef } = useDroppable({ id: item.id, data: { item, parent_index } })

	return (
		<div
			className={$cx('w_100 border_box flex flex_column relative', styles._local, isOver && styles.isOver)}
			ref={setNodeRef}
		>
			{children}
		</div>
	)
}

export default $app.memo(Index)
