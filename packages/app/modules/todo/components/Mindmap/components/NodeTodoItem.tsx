import TodoItem from '../../TodoItem'
import { useContext } from '../context'
import NodeWrapper from './NodeWrapper'

import type { NodeProps } from '@xyflow/react'
import type { ReactElement } from 'react'

const Index = (props: NodeProps) => {
	const context = useContext(v => ({
		tag: v.tags,
		angles: v.angles,
		check: v.check,
		insert: v.insert,
		update: v.update,
		tab: v.tab,
		moveTo: v.moveTo,
		remove: v.remove,
		showDetailModal: v.showDetailModal
	}))

	const data = {
		...props.data,
		...context,
		kanban_mode: 'angle',
		useByMindmap: true
	}

	return <NodeWrapper children={TodoItem as unknown as ReactElement} {...props} data={data} />
}

export default $app.memo(Index)
