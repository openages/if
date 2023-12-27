import { useMemoizedFn } from 'ahooks'
import { Table } from 'antd'
import dayjs from 'dayjs'
import styles from './index.css'

import type { Todo } from '@/types'
import type { TableColumnsType } from 'antd'
import type { IPropsTable } from '../../types'

const Index = (props: IPropsTable) => {
	const { items } = props

	const columns = [
		{
			title: 'text',
			dataIndex: 'text',
			width: 270,
			ellipsis: true
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
			dataIndex: 'tag_ids',
			ellipsis: true
		},
		{
			title: 'remind',
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
			dataIndex: 'create_at',
			align: 'right',
			render: v => dayjs().to(dayjs(v))
		}
	] as TableColumnsType<Todo.Todo>

	return (
		<div className={$cx('w_100 border_box', styles._local)}>
			<Table
				size='small'
				columns={columns}
				dataSource={items}
				rowKey={item => item.id}
				components={{
					body: {
						cell: useMemoizedFn(({ onMouseEnter, onMouseLeave, ...rest }) => <td {...rest} />)
					}
				}}
			></Table>
		</div>
	)
}

export default $app.memo(Index)
