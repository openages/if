import type { MemoExoticComponent } from 'react'

export interface IProps {
	columns: Array<Column>
	dataSource: Array<any>
	rowKey?: string
	loading?: boolean
	stickyTop?: number
	scrollX?: number
	onChange: (index: number, v: any) => void
	getRowClassName?: (item: any) => Array<string>
}

export interface Column {
	title: string
	dataIndex: string
	deps: Array<string>
	component: JSX.Element | MemoExoticComponent<any>
	width?: number
	align?: 'left' | 'center' | 'right'
	fixed?: 'left' | 'right'
	stickyOffset?: number
	sort?: boolean
	extra?: any
	getProps?: (...args: any) => any
	onAction?: (action: string, deps: any, index: number) => void
}

export interface IPropsColGroup {
	columns: Array<Column>
}

export interface IPropsHeader extends Pick<IProps, 'columns' | 'stickyTop'> {
	left_shadow_index: number | null
	right_shadow_index: number | null
}

export interface IPropsTh {
	title: Column['title']
	sort: Column['sort']
	align: Column['align']
	fixed: Column['fixed']
	stickyOffset: Column['stickyOffset']
	shadow?: 'start' | 'end' | ''
}

export interface IPropsRow extends Pick<IProps, 'columns' | 'onChange' | 'getRowClassName'> {
	item: any
	index: number
	left_shadow_index: number | null
	right_shadow_index: number | null
}

export interface IPropsColumn {
	row_index: number
	dataIndex: string
	deps: any
	component: Column['component']
	align: Column['align']
	fixed: Column['fixed']
	extra: Column['extra']
	stickyOffset: Column['stickyOffset']
	shadow?: 'start' | 'end' | ''
	getProps: Column['getProps']
	onAction: Column['onAction']
}

export interface IPropsPagination {}

export interface Component<T = any> {
	value?: T
	row_index: number
	dataIndex: string
	deps: any
	extra: Column['extra']
	getProps?: Column['getProps']
	onAction?: Column['onAction']
	onChange?: (...args: any) => any
}
