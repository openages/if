import { useEffect, useRef, useState } from 'react'
import { container } from 'tsyringe'

import styles from './index.css'
import Model from './model'

import type { IPropsMindmap } from '../../types'

const Index = (props: IPropsMindmap) => {
	const [x] = useState(() => container.resolve(Model))

	const {
		file_id,
		name,
		kanban_items,
		tags,
		angles,
		relations,
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
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!angles.length) return
		if (Object.keys(kanban_items).some(angle_id => !kanban_items[angle_id].loaded)) return

		x.init({ container: ref.current, file_id, name, kanban_items })

		return () => x.off()
	}, [kanban_items, tags, angles])

	return (
		<div className={$cx('flex', styles._local)}>
			<div className='mindmap_wrap w_100 h_100 border_box flex'>
				<div className='w_100 h_100' ref={ref}></div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
