import { useMemoizedFn } from 'ahooks'
import { Table } from 'antd'
import { useMemo } from 'react'

import { deepEqual } from '@openages/stk/react'

import {
	Cell,
	RenderArchive,
	RenderCreateAt,
	RenderCycle,
	RenderRemark,
	RenderRemind,
	RenderSchedule,
	RenderStar,
	RenderStatus,
	RenderTags,
	RenderText,
	Row
} from './components'
import styles from './index.css'

import type { Todo } from '@/types'
import type { TableColumnType } from 'antd'
import type { TdHTMLAttributes } from 'react'
import type { IPropsTable } from '../../types'

const Index = (props: IPropsTable) => {
	const { items, tags, onTableRowChange } = props

	const raw_columns = [
		{
			dataIndex: 'status',
			width: 12,
			align: 'right',
			render: () => <RenderStatus></RenderStatus>
		},
		{
			title: 'text',
			dataIndex: 'text',
			width: 180,
			ellipsis: true,
			render: () => <RenderText></RenderText>
		},
		{
			title: 'tags',
			dataIndex: 'tag_ids',
			width: 96,
			align: 'center',
			render: () => <RenderTags options={tags}></RenderTags>
		},
		{
			title: 'star',
			dataIndex: 'star',
			width: 96,
			align: 'center',
			render: () => <RenderStar></RenderStar>
		},
		{
			title: 'remind',
			dataIndex: 'remind_time',
			width: 96,
			align: 'center',
			render: () => <RenderRemind></RenderRemind>
		},
		{
			title: 'cycle',
			dataIndex: 'cycle',
			width: 96,
			align: 'center',
			deps: ['cycle_enabled'],
			render: (_, item) => <RenderCycle cycle_enabled={item.cycle_enabled}></RenderCycle>
		},
		{
			title: 'schedule',
			dataIndex: 'schedule',
			width: 60,
			align: 'center',
			render: () => <RenderSchedule></RenderSchedule>
		},
		{
			title: 'remark',
			dataIndex: 'remark',
			width: 60,
			align: 'center',
			render: () => <RenderRemark></RenderRemark>
		},
		{
			title: 'archive',
			dataIndex: 'archive',
			width: 81,
			align: 'center',
			ellipsis: true,
			ignoreArchive: true,
			deps: ['archive_time'],
			render: (_, item) => <RenderArchive archive_time={item.archive_time}></RenderArchive>
		},
		{
			title: 'create_at',
			dataIndex: 'create_at',
			align: 'right',
			ellipsis: true,
			ignoreArchive: true,
			render: () => <RenderCreateAt></RenderCreateAt>
		}
	] as Array<TableColumnType<Todo.Todo> & { ignoreArchive?: boolean; deps?: Array<Partial<keyof Todo.Todo>> }>

	const target_columns = useMemo(() => {
		return raw_columns.map(column => {
			column.onCell = item => {
				return {
					name: (column as TableColumnType<Todo.Todo>).dataIndex,
					archive: column.ignoreArchive ? false : item.archive
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
	}, [raw_columns])

	const components = useMemo(() => ({ body: { row: Row, cell: Cell } }), [])

	const onRow = useMemoizedFn((item, index) => ({ item, index, onTableRowChange }) as TdHTMLAttributes<any>)

	return (
		<div className={$cx('w_100 border_box', styles._local)}>
			<Table
				size='small'
				rowKey={item => item.id}
				components={components}
				columns={target_columns}
				dataSource={items}
				onRow={onRow}
			></Table>
		</div>
	)
}

export default $app.memo(Index)
