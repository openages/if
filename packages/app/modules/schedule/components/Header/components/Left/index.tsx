import { Tooltip } from 'antd'

import { scales, views } from '@/appdata/schedule'
import { ListChecks } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderLeft } from '../../../../types'

const Index = (props: IPropsHeaderLeft) => {
	const { view, scale, visible_task_panel, toggleVisibleTaskPanel, changeView, changeScale } = props

	return (
		<div className={$cx('absolute flex align_center', styles._local)}>
			<button
				className={$cx(
					'btn_toggle_panel flex justify_center align_center clickable',
					visible_task_panel && 'active'
				)}
				onClick={toggleVisibleTaskPanel}
			>
				<ListChecks></ListChecks>
			</button>
			<div className='d_line'></div>
			<div className='toggle_wrap flex align_center'>
				{views.map(item => (
					<Tooltip title={item.value} key={item.value}>
						<div
							className={$cx(
								'toggle_item h_100 flex justify_center align_center clickable',
								view === item.value && 'active'
							)}
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
							className={$cx(
								'toggle_item h_100 flex justify_center align_center clickable',
								scale === item.value && 'active'
							)}
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
