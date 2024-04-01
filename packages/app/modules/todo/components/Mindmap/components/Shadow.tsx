import { diff } from 'just-diff'
import { set } from 'lodash-es'
import { useEffect, useState } from 'react'

import { useNodesState, ReactFlow } from '@xyflow/react'

import { node_types } from './'
import Layout from './Layout'

import type { IPropsShadow, IPropsLayout } from '../types'

const Index = (props: IPropsShadow) => {
	const { pure_nodes, layout } = props
	const [nodes, setNodes] = useNodesState([])
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		if (loaded) {
			setNodes(prev_nodes => {
				let target_nodes = null

				const changes = diff(pure_nodes, prev_nodes, path => ({
					node: prev_nodes.at(path[0] as number),
					path: path
				}))

				const { updates, adds, removes } = changes.reduce(
					(total, item) => {
						if (item.op === 'replace') total.updates.push(item)
						if (item.op === 'add') total.adds.push(item)
						if (item.op === 'remove') total.removes.push(item)

						return total
					},
					{ updates: [], adds: [], removes: [] }
				)

				target_nodes = prev_nodes.map(node => {
					const update_item = updates.find(i => i.path.node.id === node.id)

					if (!update_item) return node

					const path = update_item.path.path
					const value = update_item.value
					const target_node = $copy(node)

					path.shift()

					set(target_node, path, value)

					console.log($copy(node), target_node)

					return target_node
				})

				// changes.forEach(change => {
				//       match(change.op)
				//             .with('replace', () => {
				//                   const path = change.path.path
				//                   const value = change.value
				//                   const node = $copy(change.path.node)

				//                   set(node, path, value)

				//                   if (path.length === 4) {
				//                         updateNode(change.path.node.id, node)
				//                   }

				//                   if (path.length === 6) {
				//                   }
				//             })
				//             .with('add', () => {})
				//             .with('remove', () => {})
				//             .exhaustive()
				// })

				return target_nodes
			})

			return
		}

		if (!pure_nodes.length) return

		setNodes(pure_nodes)
		setLoaded(true)
	}, [loaded, pure_nodes])

	const props_layout: IPropsLayout = {
		layout
	}

	return (
		<div className='shadow_wrap absolute top_0 left_0'>
			<ReactFlow className='shadow_graph' minZoom={0.3} nodeTypes={node_types} nodes={nodes}>
				<Layout {...props_layout} />
			</ReactFlow>
		</div>
	)
}

export default $app.memo(Index)
