import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { useMemo } from 'react'

import { Funnel, GearSix } from '@phosphor-icons/react'

import TagOptionRender from '../../../TagOptionRender'
import TagSelectRender from '../../../TagSelectRender'
import styles from './index.css'

import type { IPropsHeaderRight } from '../../../../types'
import type { Tag } from '@/types'

const Index = (props: IPropsHeaderRight) => {
	const { tags, filter_tags, showSettingsModal, changeFilterTags } = props

	const color_tags = useMemo(() => tags.map(item => ({ ...item, text: `${item.text}|${item.color}` })), [tags])

	const onChangeFilterTags = useMemoizedFn((_, v) => changeFilterTags(v.map((item: Tag) => item.id)))

	return (
		<div className={$cx('absolute flex align_center', styles._local)}>
			<Select
				className={$cx(filter_tags.length && 'has_value')}
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
