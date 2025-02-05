import { useMemoizedFn } from 'ahooks'

import { views } from '@/appdata/schedule'
import { ListChecks } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderLeft } from '../../../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsHeaderLeft) => {
	const { view, scale, visible_task_panel, changeView, changeScale, toggleVisibleTaskPanel } = props

	const onChangeType = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('btn_std')) {
			if (!target?.parentElement) break

			target = target.parentElement as HTMLDivElement
		}

		const key = target?.getAttribute('data-key') as keyof typeof views

		if (!key) return

		const mode = views[key]

		changeView(mode.value.view)
		changeScale(mode.value.scale)
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
			<div className='mode_wrap border_box flex align_center' onClick={onChangeType}>
				{Object.values(views).map(({ key, icon, getActive }) => (
					<div
						className={$cx(
							'btn_std border_box flex justify_center align_center clickable',
							getActive(view, scale) && 'active'
						)}
						data-key={key}
						key={key}
					>
						{icon}
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
