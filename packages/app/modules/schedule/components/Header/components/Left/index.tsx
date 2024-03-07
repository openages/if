import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'

import { scales, views } from '@/appdata/schedule'
import { ListChecks } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderLeft } from '../../../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsHeaderLeft) => {
	const { view, scale, visible_task_panel, toggleVisibleTaskPanel, changeView, changeScale } = props

	const onChangeView = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('btn_std')) {
			target = target.parentElement as HTMLDivElement
		}

		changeView(target?.getAttribute('data-key') as IPropsHeaderLeft['view'])
	})

	const onChangeScale = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('btn_std')) {
			target = target.parentElement as HTMLDivElement
		}

		changeScale(target?.getAttribute('data-key') as IPropsHeaderLeft['scale'])
	})

	return (
		<div className={$cx('absolute flex align_center', styles._local)}>
			<button
				className={$cx(
					'btn_std flex justify_center align_center clickable',
					visible_task_panel && 'active'
				)}
				onClick={toggleVisibleTaskPanel}
			>
				<ListChecks></ListChecks>
			</button>
			<div className='d_line'></div>
			<div className='toggle_wrap flex align_center' onClick={onChangeView}>
				{views.map(item => (
					<Tooltip title={item.value} key={item.value}>
						<div
							className={$cx(
								'btn_std h_100 flex justify_center align_center clickable',
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
			<div className='toggle_wrap flex align_center' onClick={onChangeScale}>
				{scales.map(item => (
					<Tooltip title={item.value} key={item.value}>
						<div
							className={$cx(
								'btn_std h_100 flex justify_center align_center clickable',
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
