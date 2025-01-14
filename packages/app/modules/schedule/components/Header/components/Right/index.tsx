import { useMemoizedFn } from 'ahooks'
import { Popover, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { views } from '@/appdata/schedule'
import { Funnel, GearSix, SlidersHorizontal } from '@phosphor-icons/react'

import TagOptionRender from '../../../TagOptionRender'
import TagSelectRender from '../../../TagSelectRender'
import styles from './index.css'

import type { IPropsHeaderRight } from '../../../../types'
import type { Tag } from '@/types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsHeaderRight) => {
	const { view, scale, changeView, changeScale, tags, filter_tags, showSettingsModal, changeFilterTags } = props
	const { t } = useTranslation()

	const color_tags = useMemo(() => tags.map(item => ({ ...item, text: `${item.text}|${item.color}` })), [tags])

	const onChangeType = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('mode_item_wrap')) {
			if (!target?.parentElement) break

			target = target.parentElement as HTMLDivElement
		}

		const key = target?.getAttribute('data-key') as keyof typeof views

		if (!key) return

		const mode = views[key]

		changeView(mode.value.view)
		changeScale(mode.value.scale)
	})

	const onChangeFilterTags = useMemoizedFn((_, v) => changeFilterTags(v.map((item: Tag) => item.id)))

	const Setting = (
		<div className={$cx('flex flex_column w_100 border_box', styles.setting_wrap)}>
			<div className='mode_wrap w_100 border_box flex flex_wrap' onClick={onChangeType}>
				{Object.values(views).map(({ key, icon, getActive }) => (
					<div
						className={$cx(
							'mode_item_wrap border_box flex flex_column align_center clickable',
							getActive(view, scale) && 'active'
						)}
						data-key={key}
						key={key}
					>
						{icon}
						<span className='text'>{t(`schedule.Header.${key}`)}</span>
					</div>
				))}
			</div>
		</div>
	)

	return (
		<div className={$cx('absolute flex align_center', styles._local)}>
			<Select
				className={$cx(filter_tags.length > 0 && 'has_value')}
				variant='borderless'
				popupClassName='borderless'
				placement='bottomRight'
				suffixIcon={
					<button className='btn_std active flex justify_center align_center clickable'>
						<Funnel></Funnel>
					</button>
				}
				fieldNames={{ label: 'text', value: 'id' }}
				maxCount={3}
				mode='multiple'
				value={filter_tags}
				options={color_tags}
				tagRender={TagSelectRender}
				optionRender={TagOptionRender}
				onChange={onChangeFilterTags}
			></Select>
			<Popover trigger={['click']} content={Setting}>
				<div>
					<div className='btn_std active border_box flex justify_center align_center cursor_point clickable'>
						<SlidersHorizontal></SlidersHorizontal>
					</div>
				</div>
			</Popover>
			<button
				className='btn_std active flex justify_center align_center clickable'
				onClick={showSettingsModal}
			>
				<GearSix></GearSix>
			</button>
		</div>
	)
}

export default $app.memo(Index)
