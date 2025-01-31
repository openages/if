import type Model from './model'

export interface IPropsHeader {
	type: Model['type']
	current: Model['current']
	total: number
	setType: (v: Model['type']) => void
	prev: Model['prev']
	next: Model['next']
}

export interface IPropsChart {
	type: Model['type']
	index: Model['index']
	chart_data: Model['chart_data']
	setIndex: (v: Model['index']) => void
}

export interface IPropsTypeChart {
	index: Model['index']
	chart_data: Model['chart_data']
	setIndex: (v: Model['index']) => void
}

export interface IPropsList {
	data_items: Model['data_items']
}
