import { useMemoizedFn } from 'ahooks'
import { Table } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import {
	Cell,
	RenderArchive,
	RenderCycle,
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
	const { items, tags } = props

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
			width: 102,
			render: () => <RenderTags options={tags}></RenderTags>
		},
		{
			title: 'star',
			dataIndex: 'star',
			width: 96,
			render: () => <RenderStar></RenderStar>
		},
		{
			title: 'remind',
			dataIndex: 'remind_time',
			width: 96,
			render: () => <RenderRemind></RenderRemind>
		},
		{
			title: 'cycle',
			dataIndex: 'cycle',
			width: 96,
			deps: ['cycle_enabled'],
			render: (_, item) => <RenderCycle cycle_enabled={item.cycle_enabled}></RenderCycle>
		},
		{
			title: 'archive',
			dataIndex: 'archive',
			width: 96,
			align: 'center',
			ellipsis: true,
			deps: ['archive_time'],
			render: (_, item) => <RenderArchive archive_time={item.archive_time}></RenderArchive>
		},
		{
			title: 'remark',
			dataIndex: 'remark',
			align: 'center'
		},
		{
			title: 'schedule',
			dataIndex: 'schedule',
			width: 60,
			align: 'center',
			render: () => <RenderSchedule></RenderSchedule>
		},
		{
			title: 'create_at',
			dataIndex: 'create_at',
			width: 120,
			align: 'right',
			render: v => <span className='create_at'>{dayjs(v).format('YYYY-MM-DD HH:mm:ss')}</span>
		}
	] as Array<TableColumnType<Todo.Todo> & { deps?: Array<Partial<keyof Todo.Todo>> }>

	const target_columns = useMemo(() => {
		return raw_columns.map(column => {
			column.onCell = () => {
				return { name: (column as TableColumnType<Todo.Todo>).dataIndex } as TdHTMLAttributes<any>
			}

			// column.shouldCellUpdate

			return column
		})
	}, [raw_columns])

	const components = useMemo(() => ({ body: { row: Row, cell: Cell } }), [])

	const onRow = useMemoizedFn(item => ({ item }) as TdHTMLAttributes<any>)

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
