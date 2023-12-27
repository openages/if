import { Table } from 'antd'
import styles from './index.css'

import type { Todo } from '@/types'
import type { TableColumnsType } from 'antd'
import type { IPropsTable } from '../../types'

const Index = (props: IPropsTable) => {
	const { items } = props

	const columns = [
		{
			title: 'text',
			dataIndex: 'text'
		},
		{
			title: 'status',
			dataIndex: 'status'
		},
		{
			title: 'archive',
			dataIndex: 'archive'
		},
		{
			title: 'schedule',
			dataIndex: 'schedule'
		},
		{
			title: 'star',
			dataIndex: 'star'
		},
		{
			title: 'tag_ids',
			dataIndex: 'tag_ids'
		},
		{
			title: 'remind_time',
			dataIndex: 'remind_time'
		},
		{
			title: 'cycle',
			dataIndex: 'cycle'
		},
		{
			title: 'remark',
			dataIndex: 'remark'
		},
		{
			title: 'create_at',
			dataIndex: 'create_at'
		}
	] as TableColumnsType<Todo.Todo>

	return (
		<div className={$cx('w_100', styles._local)}>
			<Table columns={columns} dataSource={items} rowKey={item => item.id}></Table>
		</div>
	)
}

export default $app.memo(Index)
