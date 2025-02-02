import type Model from './model'

export interface IPropsHeader {
	type: Model['type']
	current: Model['current']
	total: number
	setType: (v: Model['type']) => void
	reset: Model['reset']
	prev: Model['prev']
	next: Model['next']
	share: Model['share']
}

export interface IPropsChart {
	type: Model['type']
	index: Model['index']
	chart_data: Model['chart_data']
	setIndex: (v: Model['index']) => void
	setChartDom: (v: Model['chart_dom']) => void
}

export interface IPropsTypeChart {
	index: Model['index']
	chart_data: Model['chart_data']
	setIndex: (v: Model['index']) => void
	setChartDom: (v: Model['chart_dom']) => void
}

export interface IPropsList {
	data_items: Model['data_items']
}
