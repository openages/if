import type { MemoExoticComponent, MutableRefObject } from 'react'
import type { PaginationProps } from 'antd'

export interface IProps {
	columns: Array<Column>
	dataSource: Array<any>
	rowKey?: string
	loading?: boolean
	stickyTop?: number
	scroller?: MutableRefObject<HTMLDivElement>
	scrollX?: number
	pagination?: PaginationProps | false
	onChange: (index: number, v: any) => void
	onChangeSort?: (v: { field: string; order: 'desc' | 'asc' | null }) => void
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
	alwaysEditing?: boolean
	disableEditing?: boolean
	disableResetEditing?: boolean
	getProps?: (...args: any) => any
	onAction?: (action: string, deps: any, index: number) => void
}

export interface IPropsColGroup {
	columns: Array<Column>
}

export interface IPropsHeader extends Pick<IProps, 'columns' | 'stickyTop'> {
	scrollerX: HTMLDivElement
	scrollerY: HTMLDivElement
	left_shadow_index: number | null
	right_shadow_index: number | null
	sort: { field: string; order: 'desc' | 'asc' | null }
	changeSort: (field: string) => void
}

export interface IPropsTh {
	title: Column['title']
	dataIndex: Column['dataIndex']
	showSort: boolean
	sort: IPropsHeader['sort'] | undefined
	align: Column['align']
	fixed: Column['fixed']
	stickyOffset: Column['stickyOffset']
	shadow?: 'start' | 'end' | ''
	changeSort?: IPropsHeader['changeSort']
}

export interface IPropsRow extends Pick<IProps, 'columns' | 'onChange' | 'getRowClassName'> {
	item: any
	index: number
	left_shadow_index: number | null
	right_shadow_index: number | null
	sort: IPropsHeader['sort']
	editing_field: string | undefined
	setEditingInfo: (v: { row_index: number; field: string } | null) => void
}

export interface IPropsColumn {
	value: any
	row_index: number
	dataIndex: string
	deps: any
	component: Column['component']
	align: Column['align']
	fixed: Column['fixed']
	extra: Column['extra']
	stickyOffset: Column['stickyOffset']
	editing: boolean
	shadow?: 'start' | 'end' | ''
	sorting?: boolean
	setEditingField: ((v: string) => void) | undefined
	getProps: Column['getProps']
	onAction: Column['onAction']
}

export interface IPropsPagination extends PaginationProps {}

export interface Component<T = any> {
	value?: T
	row_index: number
	dataIndex: string
	deps: any
	extra: Column['extra']
	editing: boolean
	setEditingField: IPropsColumn['setEditingField']
	getProps?: Column['getProps']
	onAction?: Column['onAction']
	onChange?: (...args: any) => any
}
