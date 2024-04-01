import { diff } from 'just-diff'
import { set } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { getNodeEdge, layout } from './utils'

import type { Node, Edge, Instance, FitView } from '@xyflow/react'
import type { IPropsMindmap } from '@/modules/todo/types'

@injectable()
export default class Index {
	props = {} as IPropsMindmap
	pure_nodes = [] as Array<Node>
	nodes = [] as Array<Node>
	edges = [] as Array<Edge>

	handlers = {} as {
		fitView: FitView
		updateNode: Instance.UpdateNode
		updateNodeData: Instance.UpdateNodeData
		addNodes: Instance.AddNodes
		addEdges: Instance.AddEdges
		deleteElements: Instance.DeleteElements
	}

	constructor() {
		makeAutoObservable(this, { props: false, handlers: false }, { autoBind: true })
	}

	init(props: Index['props']) {
		this.props = props

		this.render()
	}

	render() {
		const { nodes, edges } = getNodeEdge(this.props)

		this.pure_nodes = nodes
		this.edges = edges
	}

	layout(v: Array<Node>) {
		const { updateNode } = this.handlers

		// console.log(v)
		console.log(v.find(i => !i.computed.height))

		const nodes = layout(this.props, v)
		// console.log(v, $copy(nodes))

		if (this.nodes.length) {
			const changes = diff($copy(this.nodes), nodes, path => ({
				node: nodes.at(path[0] as number),
				path: path
			}))

			// console.log(changes, nodes)

			changes.forEach(change => {
				match(change.op)
					.with('replace', () => {
						const path = change.path.path
						const value = change.value
						const node = $copy(change.path.node)

						set(node, path, value)

						if (path.length === 4) {
							updateNode(change.path.node.id, node)
						}

						if (path.length === 6) {
						}
					})
					.with('add', () => {})
					.with('remove', () => {})
					.exhaustive()
			})
		} else {
			this.nodes = nodes
		}
	}

	setHandlers(v: Index['handlers']) {
		this.handlers = v
	}
}
