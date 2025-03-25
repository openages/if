import { useMemoizedFn } from 'ahooks'
import { Segmented } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Browser, ClockCountdown, GearSix, MagnifyingGlass, SquaresFour, Star } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHomeDrawerHeader } from '@/layout/types'
import type { SegmentedLabeledOption } from 'antd/es/segmented'
import type { ReactNode } from 'react'
import type { Stack, DirTree } from '@/types'

const Index = (props: IPropsHomeDrawerHeader) => {
	const { tab, setTab, showSetting: _showSetting, closeHome } = props
	const { t } = useTranslation()

	const options_file = useMemo(
		() =>
			[
				{
					label: t('layout.Home.latest'),
					value: 'latest',
					icon: <ClockCountdown></ClockCountdown>
				},
				{
					label: t('layout.Home.star'),
					value: 'star',
					icon: <Star></Star>
				},
				{
					label: t('layout.Home.apps'),
					value: 'apps',
					icon: <SquaresFour></SquaresFour>
				}
			] as Array<SegmentedLabeledOption<IPropsHomeDrawerHeader['tab']> & { icon: ReactNode }>,
		[]
	)

	const showHomePage = useMemoizedFn(() => {
		$app.Event.emit('global.stack.add', {
			id: '__homepage__',
			module: 'homepage',
			file: {
				id: '__homepage__',
				icon: ':browser:',
				name: t('modules.homepage')
			} as DirTree.Item,
			active: true,
			fixed: true,
			outlet: null,
			top: true
		} as Stack.View)

		closeHome()
	})

	const showSearch = useMemoizedFn(() => {
		$app.Event.emit('global.app.showSearch')

		closeHome()
	})

	const showSetting = useMemoizedFn(() => {
		_showSetting()
		closeHome()
	})

	return (
		<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
			<div className='top_row w_100 border_box flex justify_end align_center'>
				<div className='btn flex justify_center align_center clickable' onClick={showHomePage}>
					<Browser></Browser>
				</div>
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
