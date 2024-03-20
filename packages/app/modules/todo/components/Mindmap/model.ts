import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Graph } from '@antv/x6'

import { getGraphData, transform } from './utils'

import type Model from '../../model'

@injectable()
export default class Index {
	graph = null as Graph
	file_id = '' as string
	name = '' as string
	kanban_items = {} as Model['kanban_items']

	constructor() {
		makeAutoObservable(
			this,
			{ graph: false, file_id: false, name: false, kanban_items: false },
			{ autoBind: true }
		)
	}

	init(args: {
		container: HTMLDivElement
		file_id: Index['file_id']
		name: Index['name']
		kanban_items: Index['kanban_items']
	}) {
		const { container, file_id, name, kanban_items } = args

		this.file_id = file_id
		this.name = name
		this.kanban_items = kanban_items

		this.new(container)
		this.on()
		this.load()
	}

	new(container: HTMLDivElement) {
		this.graph = new Graph({
			container,
			interacting: false,
			autoResize: true,
			panning: true,
			mousewheel: true,
			background: {
				color: 'transparent'
			},
			connecting: {
				connector: 'smooth'
			}
		})
	}

	load() {
		const layout_data = getGraphData(this.file_id, this.name, this.kanban_items)
		const graph_data = transform(layout_data)

		this.graph.fromJSON(graph_data)

		console.log(graph_data)
	}

	on() {
		this.graph.on('render:done', () => {
			this.graph.centerContent()
		})
	}

	off() {
		this.graph?.dispose?.()
	}
}
