import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getNodeEdge, layout } from './utils'

import type { Node, Edge } from '@xyflow/react'
import type { IPropsMindmap } from '@/modules/todo/types'

@injectable()
export default class Index {
	props = {} as IPropsMindmap
	nodes = [] as Array<Node>
	edges = [] as Array<Edge>
	layouted = false

	constructor() {
		makeAutoObservable(this, { props: false }, { autoBind: true })
	}

	init(props: Index['props']) {
		this.props = props

		this.render()
	}

	render() {
		const { nodes, edges } = getNodeEdge(this.props)

		this.nodes = nodes
		this.edges = edges
	}

	layout(nodes: Array<Node>) {
		this.nodes = layout(this.props, nodes)
		this.layouted = true
	}
}
