import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { scales, scale_year, views } from '@/appdata/schedule'
import { ListChecks } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderLeft } from '../../../../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsHeaderLeft) => {
	const { view, scale, visible_task_panel, toggleVisibleTaskPanel, changeView, changeScale } = props
	const { t } = useTranslation()

	const target_scales = useMemo(() => (view !== 'timeline' ? scales : [...scales, scale_year]), [view])

	const onChangeView = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('btn_std')) {
			if (!target?.parentElement) break

			target = target.parentElement as HTMLDivElement
		}

		const key = target?.getAttribute('data-key') as IPropsHeaderLeft['view']

		if (!key) return

		changeView(key)
	})

	const onChangeScale = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('btn_std')) {
			if (!target?.parentElement) break

			target = target.parentElement as HTMLDivElement
		}

		const key = target?.getAttribute('data-key') as IPropsHeaderLeft['scale']

		if (!key) return

		changeScale(key)
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
					<Tooltip
						title={t(`translation:schedule.Header.view.${item.value}`)}
						destroyTooltipOnHide
						key={item.value}
					>
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
				{target_scales.map(item => (
					<Tooltip
						title={t(`translation:common.time.${item.value as IPropsHeaderLeft['scale']}`)}
						destroyTooltipOnHide
						key={item.value}
					>
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
