import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getGraphData, transform } from './utils'

import type Model from '../../model'

@injectable()
export default class Index {
	file_id = '' as string
	name = '' as string
	kanban_items = {} as Model['kanban_items']

	constructor() {
		makeAutoObservable(this, { file_id: false, name: false, kanban_items: false }, { autoBind: true })
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

	new(container: HTMLDivElement) {}

	load() {
		const layout_data = getGraphData(this.file_id, this.name, this.kanban_items)
		const graph_data = transform(layout_data)

		console.log(graph_data)
	}

	on() {}

	off() {}
}
