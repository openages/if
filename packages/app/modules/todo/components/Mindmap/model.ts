import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getGraphData } from './utils'

import type Model from '../../model'
import type { Node, Edge } from '@xyflow/react'

@injectable()
export default class Index {
	file_id = '' as string
	name = '' as string
	kanban_items = {} as Model['kanban_items']
	nodes = [] as Array<Node>
	edges = [] as Array<Edge>

	constructor() {
		makeAutoObservable(this, { file_id: false, name: false, kanban_items: false }, { autoBind: true })
	}

	init(args: {
		file_id: Index['file_id']
		name: Index['name']
		kanban_items: Index['kanban_items']
	}) {
		const { file_id, name, kanban_items } = args

		this.file_id = file_id
		this.name = name
		this.kanban_items = kanban_items

		this.load()
	}

	load() {
		const { nodes, edges } = getGraphData(this.file_id, this.name, this.kanban_items)

		this.nodes = nodes
		this.edges = edges
	}
}
