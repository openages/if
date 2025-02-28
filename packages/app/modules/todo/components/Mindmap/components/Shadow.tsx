import { useEffect } from 'react'

import { useNodes, useReactFlow, ReactFlow } from '@xyflow/react'

import styles from '../index.css'
import { node_types } from './'

import type { IPropsShadow } from '../types'

const Index = (props: IPropsShadow) => {
	const { pure_nodes, layout, setHandlers } = props
	const nodes = useNodes()
	const { setNodes } = useReactFlow()

	useEffect(() => {
		if (!nodes.length) return
		if (nodes.some(item => !item?.measured?.width || !item?.measured?.height)) return

		layout(nodes)
		setHandlers({ setNodes })
	}, [nodes])

	return (
		<div className={$cx('absolute top_0 left_0 h_100vh w_100vw', styles.shadow)}>
			<ReactFlow className='shadow_graph' nodeTypes={node_types} defaultNodes={pure_nodes}></ReactFlow>
		</div>
	)
}

export default $app.memo(Index)
