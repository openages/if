import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { setElements } from '@/utils'
import { deepEqual } from '@openages/stk/react'

import { getNodeEdge, layout } from './utils'

import type { Node, Edge, Instance, FitView } from '@xyflow/react'
import type { IPropsMindmap } from '@/modules/todo/types'

@injectable()
export default class Index {
	props = {} as IPropsMindmap
	pure_nodes = [] as Array<Node>
	nodes = [] as Array<Node>
	edges = [] as Array<Edge>
	signal = false

	shadow_handlers = {} as {
		setNodes: Instance.SetNodes
	}

	graph_handlers = {} as {
		fitView: FitView
		setNodes: Instance.SetNodes
		setEdges: Instance.SetEdges
	}

	constructor() {
		makeAutoObservable(
			this,
			{
				props: false,
				pure_nodes: false,
				nodes: false,
				edges: false,
				shadow_handlers: false,
				graph_handlers: false
			},
			{ autoBind: true }
		)
	}

	init(props: Index['props']) {
		this.props = props

		this.getNodeEdge()
	}

	getNodeEdge(kanban_items?: IPropsMindmap['kanban_items']) {
		if (kanban_items) this.props = { ...this.props, kanban_items }

		const { nodes, edges } = getNodeEdge(this.props)

		if (this.nodes.length) {
			this.setNodes(nodes, true)
			this.setEdges(edges)
		}

		this.pure_nodes = nodes
		this.edges = edges

		if (!this.nodes.length) this.signal = !this.signal
	}

	layout(v: Array<Node>) {
		const new_nodes = $copy(v)
		const nodes = layout(this.props, new_nodes)

		if (this.nodes.length) {
			this.setNodes(nodes)

			this.nodes = nodes
		} else {
			this.nodes = nodes
			this.signal = !this.signal
		}
	}

	setNodes(new_nodes: Array<Node>, shadow?: boolean) {
		const { setNodes } = shadow ? this.shadow_handlers : this.graph_handlers
		const prev_nodes = shadow ? this.pure_nodes : this.nodes

		setElements(prev_nodes, new_nodes, setNodes)
	}

	setEdges(new_edges: Array<Edge>) {
		const { setEdges } = this.graph_handlers

		setElements(this.edges, new_edges, setEdges)
	}
}
