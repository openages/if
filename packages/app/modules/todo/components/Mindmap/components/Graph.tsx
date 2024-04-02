import { useEffect } from 'react'

import { useReactFlow, ReactFlow } from '@xyflow/react'

import { node_types } from './'

import type { IPropsGraph } from '../types'

const Index = (props: IPropsGraph) => {
	const { theme, nodes, edges, setHandlers } = props
	const { fitView, setNodes, setEdges } = useReactFlow()

	useEffect(() => {
		fitView({ minZoom: 0.6 })
		setHandlers({ fitView, setNodes, setEdges })
	}, [])

	return (
		<div className='mindmap_wrap w_100 h_100 border_box flex'>
			<ReactFlow
				className={$cx('w_100 h_100', theme === 'dark' && 'dark')}
				minZoom={0.3}
				nodeTypes={node_types}
				defaultNodes={nodes}
				defaultEdges={edges}
			></ReactFlow>
		</div>
	)
}

export default $app.memo(Index)
