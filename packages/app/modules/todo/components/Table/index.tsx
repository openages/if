import { useMemoizedFn } from 'ahooks'
import { Table } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { deepEqual } from '@openages/stk/react'

import {
	Cell,
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
import type { TableColumnType } from 'antd'
import type { TdHTMLAttributes } from 'react'
import type { IPropsTable } from '../../types'

const Index = (props: IPropsTable) => {
	const { items, tags, table_pagination, onTableRowChange, onTablePageChange, clean, showDetailModal, remove } =
		props
	const { t } = useTranslation()

	const raw_columns = [
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
			width: 96,
			align: 'center',
			render: () => <RenderTags options={tags}></RenderTags>
		},
		{
			title: t('translation:todo.common.level'),
			dataIndex: 'level',
			width: 96,
			align: 'center',
			render: () => <RenderLevel></RenderLevel>
		},
		{
			title: t('translation:todo.Input.Remind.title'),
			dataIndex: 'remind_time',
			width: 96,
			align: 'center',
			render: () => <RenderRemind></RenderRemind>
		},
		{
			title: t('translation:todo.Input.Deadline.title'),
			dataIndex: 'end_time',
			width: 96,
			align: 'center',
			render: () => <RenderDeadline></RenderDeadline>
		},
		{
			title: t('translation:todo.Input.Cycle.title'),
			dataIndex: 'cycle',
			width: 96,
			align: 'center',
			ellipsis: true,
			deps: ['cycle_enabled'],
			render: (_, item) => <RenderCycle cycle_enabled={item.cycle_enabled}></RenderCycle>
		},
		{
			title: t('translation:modules.schedule'),
			dataIndex: 'schedule',
			width: 60,
			align: 'center',
			render: () => <RenderSchedule></RenderSchedule>
		},
		{
			title: t('translation:todo.common.children'),
			dataIndex: 'children',
			width: 60,
			align: 'center',
			render: () => <RenderChildren></RenderChildren>
		},
		{
			title: t('translation:todo.Detail.remark.title'),
			dataIndex: 'remark',
			width: 60,
			align: 'center',
			render: () => <RenderRemark></RenderRemark>
		},
		{
			title: t('translation:todo.Archive.title'),
			dataIndex: 'archive',
			width: 81,
			align: 'center',
			ellipsis: true,
			ignoreArchive: true,
			deps: ['archive_time'],
			render: (_, item) => <RenderArchive archive_time={item.archive_time}></RenderArchive>
		},
		{
			title: t('translation:todo.Header.options.sort.create_at'),
			dataIndex: 'create_at',
			align: 'right',
			ignoreArchive: true,
			render: () => <RenderCreateAt></RenderCreateAt>
		},
		{
			title: t('translation:todo.common.options'),
			width: 72,
			align: 'center',
			fixed: 'right',
			ignoreArchive: true,
			render: (_, item, index) => (
				<RenderOptions
					showDetailModal={() => showDetailModal({ id: item.id, index })}
					remove={() => remove({ id: item.id })}
					clean={() => clean(item.id)}
				></RenderOptions>
			)
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
				expandable={{ childrenColumnName: '_none_' }}
				sticky={{ offsetHeader: 0 }}
				rowKey={item => item.id}
				components={components}
				scroll={{ x: 1080 }}
				pagination={
					table_pagination.total
						? { ...table_pagination, pageSize: 15, onChange: onTablePageChange }
						: false
				}
				columns={target_columns}
				dataSource={items}
				onRow={onRow}
			></Table>
		</div>
	)
}

export default $app.memo(Index)
