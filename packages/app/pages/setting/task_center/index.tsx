import { Table } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Trash } from '@phosphor-icons/react'

import styles from './index.css'

import type { App as AppType } from '@/types'
import type { App } from '@/models'
import type { TableColumnsType } from 'antd'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))
	const actives = toJS(global.app.actives)
	const { t } = useTranslation()

	const columns: TableColumnsType<App['actives'][number]> = [
		{
			title: '名称',
			dataIndex: 'app',
			align: 'center',
			render: (v: AppType.ModuleType) => t(`translation:modules.${v}`)
		},
		{
			title: 'ID',
			dataIndex: 'app',
			align: 'center'
		},
		{
			title: 'Key',
			dataIndex: 'key',

			align: 'center'
		},
		{
			title: '操作',
			dataIndex: 'operations',
			align: 'center',
			render: (_, item) => (
				<div className='flex justify_center'>
					<div className='btn_wrap flex justify_center align_center clickable'>
						<Trash
							size={14}
							onClick={() => $app.Event.emit('global.app.exitApp', item.app)}
						></Trash>
					</div>
				</div>
			)
		}
	]

	return (
		<div className={$cx('limited_unchanged_content_wrap', styles._local)}>
			<Table
				columns={columns}
				dataSource={actives}
				rowKey={(item) => item.app}
				size='small'
				bordered
				pagination={false}
			></Table>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
