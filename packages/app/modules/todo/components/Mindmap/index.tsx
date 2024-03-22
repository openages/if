import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Background, ReactFlow } from '@xyflow/react'

import styles from './index.css'
import Model from './model'

import type { IPropsMindmap } from '../../types'
import type { BackgroundVariant } from '@xyflow/react'

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

	useEffect(() => {
		if (!angles.length) return
		if (Object.keys(kanban_items).some(angle_id => !kanban_items[angle_id].loaded)) return

		x.init({ file_id, name, kanban_items })
	}, [kanban_items, tags, angles])

	return (
		<div className={$cx('flex', styles._local)}>
			<div className='mindmap_wrap w_100 h_100 border_box flex'>
				<ReactFlow className='w_100 h_100' fitView minZoom={0.24} nodes={x.nodes} edges={x.edges}>
					<Background variant={'dots' as BackgroundVariant.Dots} />
				</ReactFlow>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
