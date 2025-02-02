import { Table } from 'antd'
import dayjs from 'dayjs'

import styles from './index.css'

import type { IPropsList } from '../../types'

import type { TableColumnsType } from 'antd'

const columns = [
	{
		dataIndex: 'text'
	},
	{
		dataIndex: 'done_time',
		render: v => dayjs(v).format('YYYY-MM-DD HH:mm')
	}
] as TableColumnsType

const Index = (props: IPropsList) => {
	const { data_items } = props

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<Table columns={columns} dataSource={data_items} rowKey={item => item.id}></Table>
		</div>
	)
}

export default $app.memo(Index)
