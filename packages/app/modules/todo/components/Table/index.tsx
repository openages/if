import { useMemoizedFn, useSize } from 'ahooks'
import { Table } from 'antd'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { getSort } from '@/appdata/const'
import { LoadingCircle } from '@/components'
import { getItemStatus } from '@/utils/modules/todo'
import { deepEqual } from '@openages/stk/react'

import {
	Cell,
	Filter,
	RenderArchive,
	RenderChildren,
	RenderCreateAt,
	RenderCycle,
	RenderDeadline,
	RenderLevel,
	RenderOptions,
	RenderRemark,
	RenderRemind,
	RenderSchedule,
	RenderStatus,
	RenderTags,
	RenderText,
	Row
} from './components'
import styles from './index.css'

import type { Todo } from '@/types'
import type { TableColumnType, PaginationProps, TableProps, SpinProps } from 'antd'
import type { TdHTMLAttributes } from 'react'
import type { IPropsTable, IPropsTableFilter } from '../../types'
import type { SorterResult } from 'antd/es/table/interface'

type Column = TableColumnType<Todo.Todo> & { ignoreArchive?: boolean; deps?: Array<Partial<keyof Todo.Todo>> }

const Index = (props: IPropsTable) => {
	const {
		relations,
		items,
		loading,
		tags,
		table_pagination,
		table_sort,
		visible_table_filter,
		search_mode,
		onTableRowChange,
		onTableSorterChange,
		onTablePageChange,
		clean,
		showDetailModal,
		remove,
		onTableSearch
	} = props
	const { t } = useTranslation()
	const ref = useRef()
	const size = useSize(ref)

	const relaxed = useMemo(() => size?.width >= 1200, [size?.width])

	const props_filter: IPropsTableFilter = {
		visible_table_filter,
		tags,
		onTableSearch
	}

	const raw_columns = useMemo(
		() =>
			[
				{
					dataIndex: 'status',
					width: 15,
					fixed: 'left',
					render: () => <RenderStatus></RenderStatus>
				},
				{
					title: t('translation:todo.common.text'),
					dataIndex: 'text',
					width: 150,
					fixed: 'left',
					render: () => <RenderText></RenderText>
				},
				{
					title: t('translation:todo.Header.options.tags'),
					dataIndex: 'tag_ids',
					width: relaxed ? 'auto' : 96,
					align: 'center',
					render: () => <RenderTags options={tags}></RenderTags>
				},
				{
					title: t('translation:todo.common.level'),
					dataIndex: 'level',
					width: relaxed ? 'auto' : 96,
					align: 'center',
					sorter: true,
					sortOrder: getSort(table_sort['level']),
					showSorterTooltip: false,
					render: () => <RenderLevel></RenderLevel>
				},
				{
					title: t('translation:todo.Input.Remind.title'),
					dataIndex: 'remind_time',
					width: relaxed ? 'auto' : 96,
					align: 'center',
					sorter: true,
					sortOrder: getSort(table_sort['remind_time']),
					showSorterTooltip: false,
					render: () => <RenderRemind></RenderRemind>
				},
				{
					title: t('translation:todo.Input.Deadline.title'),
					dataIndex: 'end_time',
					width: relaxed ? 'auto' : 96,
					align: 'center',
					sorter: true,
					sortOrder: getSort(table_sort['end_time']),
					showSorterTooltip: false,
					render: () => <RenderDeadline></RenderDeadline>
				},
				{
					title: t('translation:todo.Input.Cycle.title'),
					dataIndex: 'cycle',
					width: relaxed ? 'auto' : 96,
					align: 'center',
					ellipsis: true,
					deps: ['cycle_enabled'],
					render: (_, item) => <RenderCycle cycle_enabled={item.cycle_enabled}></RenderCycle>
				},
				{
					title: t('translation:modules.schedule'),
					dataIndex: 'schedule',
					width: relaxed ? 'auto' : 60,
					align: 'center',
					render: () => <RenderSchedule></RenderSchedule>
				},
				{
					title: t('translation:todo.common.children'),
					dataIndex: 'children',
					width: relaxed ? 'auto' : 60,
					align: 'center',
					render: () => <RenderChildren></RenderChildren>
				},
				{
					title: t('translation:todo.Detail.remark.title'),
					dataIndex: 'remark',
					width: relaxed ? 'auto' : 60,
					align: 'center',
					render: () => <RenderRemark></RenderRemark>
				},
				{
					title: t('translation:todo.Archive.title'),
					dataIndex: 'archive',
					width: relaxed ? 'auto' : 81,
					align: 'center',
					ellipsis: true,
					ignoreArchive: true,
					deps: ['archive_time'],
					render: (_, item) => <RenderArchive archive_time={item.archive_time}></RenderArchive>
				},
				{
					title: t('translation:todo.Header.options.sort.create_at'),
					dataIndex: 'create_at',
					width: relaxed ? 'auto' : 102,
					align: 'center',
					ignoreArchive: true,
					sorter: true,
					sortOrder: getSort(table_sort['create_at']),
					showSorterTooltip: false,
					render: () => <RenderCreateAt></RenderCreateAt>
				}
			] as Array<Column>,
		[relaxed, table_sort]
	)

	const column_options = useMemo(
		() =>
			[
				{
					title: t('translation:todo.common.options'),
					width: 81,
					align: 'center',
					fixed: 'right',
					ignoreArchive: true,
					render: (_, item, index) => {
						return (
							<RenderOptions
								showDetailModal={() => showDetailModal({ id: item.id, index })}
								remove={() => remove({ id: item.id })}
								clean={() => clean(item.id)}
							></RenderOptions>
						)
					}
				}
			] as Array<Column>,
		[items]
	)

	const target_columns = useMemo(() => {
		return raw_columns.map(column => {
			column.onCell = item => {
				return {
					name: (column as TableColumnType<Todo.Todo>).dataIndex,
					archive: column.ignoreArchive ? false : item.archive,
					status: getItemStatus({ relations, id: item.id, status: item.status })
				} as TdHTMLAttributes<any>
			}

			column.shouldCellUpdate = (curr, prev) => {
				const deps = (column.ignoreArchive ? [] : ['archive']) as Array<Partial<keyof Todo.Todo>>

				if (!column.deps?.length) {
					deps.push(column.dataIndex as Partial<keyof Todo.Todo>)
				} else {
					deps.push(...column.deps)
				}

				return !deps.map(key => deepEqual(curr[key], prev[key])).every(equal => equal)
			}

			return column
		})
	}, [raw_columns, relations])

	const columns = useMemo(() => target_columns.concat(column_options), [target_columns, column_options])

	const components = useMemo(() => ({ body: { row: Row, cell: Cell } }), [])

	const pagination = useMemo(() => {
		if (!table_pagination.total) return false

		return {
			...table_pagination,
			showSizeChanger: true,
			pageSizeOptions: [15, 30, 60, 120, 180, 300],
			// @ts-ignore
			showTotal: total => t('translation:common.total', { counts: total }),
			onChange: onTablePageChange
		} as PaginationProps
	}, [table_pagination])

	const table_loading = useMemo(
		() =>
			({
				spinning: loading,
				delay: 15,
				indicator: <LoadingCircle className='icon_loading' />
			}) as SpinProps,
		[loading]
	)

	const onRow: TableProps<Todo.Todo>['onRow'] = useMemoizedFn((item, index) => {
		return { item, index, onTableRowChange } as TdHTMLAttributes<any>
	})

	const onChange: TableProps<Todo.Todo>['onChange'] = useMemoizedFn((_pagination, _filter, sorter) => {
		onTableSorterChange(
			(sorter as SorterResult<Todo.Todo>).field as string,
			getSort((sorter as SorterResult<Todo.Todo>).order) as 'asc' | 'desc'
		)
	})

	return (
		<div className={$cx('w_100 border_box', styles._local)} ref={ref}>
			<Filter {...props_filter}></Filter>
			<Table
				size='small'
				expandable={{ childrenColumnName: '_none_' }}
				sticky={{ offsetHeader: 0 }}
				rowKey={item => item.id}
				components={components}
				scroll={{ x: 1080 }}
				pagination={pagination}
				loading={search_mode ? false : table_loading}
				sortDirections={['descend', 'ascend', null]}
				columns={columns}
				dataSource={items}
				onRow={onRow}
				onChange={onChange}
			></Table>
		</div>
	)
}

export default $app.memo(Index)
