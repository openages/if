import { useMemoizedFn } from 'ahooks'
import { Segmented } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ClockCountdown, GearSix, MagnifyingGlass, SquaresFour, Star } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHomepageHeader } from '@/layout/types'
import type { SegmentedLabeledOption } from 'antd/es/segmented'
import type { ReactNode } from 'react'

const Index = (props: IPropsHomepageHeader) => {
	const { tab, setTab, showSetting: _showSetting, closeHomepage } = props
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
				},
				{
					label: t('layout.Homepage.apps'),
					value: 'apps',
					icon: <SquaresFour></SquaresFour>
				}
			] as Array<SegmentedLabeledOption<IPropsHomepageHeader['tab']> & { icon: ReactNode }>,
		[]
	)

	const showSearch = useMemoizedFn(() => {
		$app.Event.emit('global.app.showSearch')

		closeHomepage()
	})

	const showSetting = useMemoizedFn(() => {
		_showSetting()
		closeHomepage()
	})

	return (
		<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
			<div className='top_row w_100 border_box flex justify_end align_center'>
				<div className='btn flex justify_center align_center clickable' onClick={showSearch}>
					<MagnifyingGlass></MagnifyingGlass>
				</div>
				<div className='btn flex justify_center align_center clickable' onClick={showSetting}>
					<GearSix></GearSix>
				</div>
			</div>
			<Segmented className='segment w_100' options={options_file} value={tab} onChange={setTab}></Segmented>
			<div className='apps_wrap w_100 flex flex_wrap'></div>
		</div>
	)
}

export default $app.memo(Index)
