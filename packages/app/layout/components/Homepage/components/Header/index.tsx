import { useMemoizedFn } from 'ahooks'
import { Segmented } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ModuleIcon } from '@/components'
import { ClockCountdown, GearSix, MagnifyingGlass, Star } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHomepageHeader } from '@/layout/types'
import type { SegmentedLabeledOption } from 'antd/es/segmented'
import type { ReactNode } from 'react'

const Index = (props: IPropsHomepageHeader) => {
	const { apps, active, setActive, showSetting: _showSetting, closeHomepage } = props
	const { t } = useTranslation()

	const options_file = useMemo(
		() =>
			[
				{
					label: t('layout.Homepage.latest'),
					value: 'latest',
					icon: <ClockCountdown></ClockCountdown>
				},
				{
					label: t('layout.Homepage.star'),
					value: 'star',
					icon: <Star></Star>
				}
			] as Array<SegmentedLabeledOption<IPropsHomepageHeader['active']> & { icon: ReactNode }>,
		[]
	)

	const options_module = useMemo(() => {
		return apps.map(item => {
			const target = {} as SegmentedLabeledOption<IPropsHomepageHeader['active']> & { icon: ReactNode }

			target['label'] = t(`modules.${item.title}`)
			target['value'] = item.id
			target['icon'] = <ModuleIcon type={item.title}></ModuleIcon>

			return target
		})
	}, [apps])

	const showSearch = useMemoizedFn(() => {
		$app.Event.emit('global.app.showSearch')

		closeHomepage()
	})

	const showSetting = useMemoizedFn(() => {
		_showSetting()
		closeHomepage()
	})

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			<Segmented className='segment' options={options_file} value={active} onChange={setActive}></Segmented>
			<Segmented
				className='segment'
				options={options_module}
				value={active}
				onChange={setActive}
			></Segmented>
			<div className='btn flex justify_center align_center clickable' onClick={showSearch}>
				<MagnifyingGlass></MagnifyingGlass>
			</div>
			<div className='btn flex justify_center align_center clickable' onClick={showSetting}>
				<GearSix></GearSix>
			</div>
		</div>
	)
}

export default $app.memo(Index)
