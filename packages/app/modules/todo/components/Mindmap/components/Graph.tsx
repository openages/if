import { useRef } from 'react'

import { useCreateEffect } from '@/hooks'
import { useOnViewportChange, useReactFlow, Controls, MiniMap, ReactFlow } from '@xyflow/react'

import { node_types } from './'

import type { IPropsGraph } from '../types'
import type { Viewport } from '@xyflow/react'

const Index = (props: IPropsGraph) => {
	const { theme, nodes, edges, setHandlers } = props
	const { fitView, setNodes, setEdges, setViewport } = useReactFlow()
	const mounted = useRef(false)
	const viewport = useRef<Viewport | null>(null)

	useOnViewportChange({
		onEnd: v => (viewport.current = v)
	})

	useCreateEffect(() => {
		if (viewport.current) setViewport(viewport.current)
		if (mounted.current) return

		fitView({ minZoom: 0.6 })
		setHandlers({ fitView, setNodes, setEdges })

		mounted.current = true
	}, [])

	return (
		<div className='mindmap_wrap w_100 h_100 border_box flex'>
			<ReactFlow
				className={$cx('w_100 h_100', theme === 'dark' && 'dark')}
				minZoom={0.3}
				nodeTypes={node_types}
				defaultNodes={nodes}
				defaultEdges={edges}
			>
				<Controls />
				<MiniMap nodeStrokeWidth={3} pannable zoomable />
			</ReactFlow>
		</div>
	)
}

export default $app.memo(Index)
