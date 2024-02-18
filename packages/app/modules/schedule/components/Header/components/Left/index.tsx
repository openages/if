import { Tooltip } from 'antd'

import { scales, views } from '@/appdata/schedule'
import { ListChecks } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('absolute flex align_center', styles._local)}>
			<button className='btn_toggle_panel flex justify_center align_center clickable'>
				<ListChecks></ListChecks>
			</button>
			<div className='d_line'></div>
			<div className='toggle_wrap flex align_center'>
				{views.map(item => (
					<Tooltip title={item.value} key={item.value}>
						<div
							className='toggle_item h_100 flex justify_center align_center clickable'
							data-key={item.value}
						>
							{item.icon}
						</div>
					</Tooltip>
				))}
			</div>
			<div className='d_line'></div>
			<div className='toggle_wrap flex align_center'>
				{scales.map(item => (
					<Tooltip title={item.value} key={item.value}>
						<div
							className='toggle_item h_100 flex justify_center align_center clickable'
							data-key={item.value}
						>
							{item.icon}
						</div>
					</Tooltip>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
