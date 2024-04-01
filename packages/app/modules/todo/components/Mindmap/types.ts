import type Model from './model'
import type { GlobalModel } from '@/context/app'

export interface IPropsShadow {
	pure_nodes: Model['pure_nodes']
	layout: Model['layout']
}

export interface IPropsLayout {
	layout: Model['layout']
}

export interface IPropsGraph {
	theme: GlobalModel['setting']['theme']
	nodes: Model['nodes']
	edges: Model['edges']
	setHandlers: Model['setHandlers']
}
