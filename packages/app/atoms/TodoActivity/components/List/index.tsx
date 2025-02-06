import { Table } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsList } from '../../types'

import type { TableColumnsType } from 'antd'

const Index = (props: IPropsList) => {
	const { unpaid, data_items } = props

	const columns = useMemo(
		() =>
			[
				{
					dataIndex: 'text',
					render: v => (unpaid ? '*'.repeat(v.length) : v)
				},
				{
					dataIndex: 'done_time',
					render: v => dayjs(v).format('YYYY-MM-DD HH:mm')
				}
			] as TableColumnsType,
		[unpaid]
	)

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<Table columns={columns} dataSource={data_items} rowKey={item => item.id}></Table>
		</div>
	)
}

export default $app.memo(Index)
