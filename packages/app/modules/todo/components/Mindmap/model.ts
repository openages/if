import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Graph } from '@antv/x6'

@injectable()
export default class Index {
	graph = null as Graph

	constructor() {
		makeAutoObservable(this, { graph: false }, { autoBind: true })
	}

	init(args: { container: HTMLDivElement }) {
		const { container } = args

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
			}
		})
	}

	load() {
		this.graph.fromJSON({
			nodes: [
				{
					id: 'node1',
					shape: 'rect',
					x: 40,
					y: 40,
					width: 100,
					height: 40,
					label: 'hello',
					attrs: {
						body: {
							stroke: '#8f8f8f',
							strokeWidth: 1,
							fill: '#fff',
							rx: 6,
							ry: 6
						}
					}
				},
				{
					id: 'node2',
					shape: 'rect',
					x: 160,
					y: 180,
					width: 100,
					height: 40,
					label: 'world',
					attrs: {
						body: {
							stroke: '#8f8f8f',
							strokeWidth: 1,
							fill: '#fff',
							rx: 6,
							ry: 6
						}
					}
				}
			],
			edges: [
				{
					shape: 'edge',
					source: 'node1',
					target: 'node2',
					label: 'x6',
					attrs: {
						line: {
							stroke: '#8f8f8f',
							strokeWidth: 1
						}
					}
				}
			]
		})
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
