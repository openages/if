import { useMemoizedFn } from 'ahooks'
import { Col, Row, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './index.css'

import type { IPropsAnalysisListHeader } from '@/modules/todo/types'
import type { SelectProps } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'

const options_sort_raw = [
	{
		value: `${$t('todo.Analysis.options_sort.importance')} (${$t('common.asc')})`,
		data: { type: 'importance', order: 'asc' }
	},
	{
		value: `${$t('todo.Analysis.options_sort.importance')} (${$t('common.desc')})`,
		data: { type: 'importance', order: 'desc' }
	},
	{
		value: `${$t('todo.Analysis.options_sort.create_at')} (${$t('common.asc')})`,
		data: { type: 'create_at', order: 'asc' }
	},
	{
		value: `${$t('todo.Analysis.options_sort.create_at')} (${$t('common.desc')})`,
		data: { type: 'create_at', order: 'desc' }
	},
	{
		value: `${$t('todo.Analysis.options_sort.done_time')} (${$t('common.asc')})`,
		data: { type: 'done_time', order: 'asc' }
	},
	{
		value: `${$t('todo.Analysis.options_sort.done_time')} (${$t('common.desc')})`,
		data: { type: 'done_time', order: 'desc' }
	}
] as Array<DefaultOptionType>

const options_group = [
	{ label: $t('common.angles.single_label'), value: 'angle' },
	{ label: $t('common.tags.single_label'), value: 'tag' }
]

const Index = (props: IPropsAnalysisListHeader) => {
	const {
		unpaid,
		angles,
		tags,
		analysis_sort_params,
		analysis_filter_angles,
		analysis_filter_tags,
		group_by,
		setSortParams,
		setFilterAngles,
		setFilterTags,
		setGroupBy
	} = props
	const { t } = useTranslation()

	const options_sort = useMemo(() => {
		return options_sort_raw.map(item => {
			const value = item.data

			let disabled = false

			if (analysis_sort_params) {
				analysis_sort_params.forEach(it => {
					if (value.type === it.type) {
						if (value.order !== it.order) {
							disabled = true
						}
					}
				})
			}

			if (item['disabled']) {
				item['disabled'] = disabled
			} else {
				if (disabled) item['disabled'] = disabled
			}

			return item
		})
	}, [analysis_sort_params])

	const onChangeAngles: SelectProps['onChange'] = useMemoizedFn(v => {
		setFilterAngles(v)
	})

	const onChangetags: SelectProps['onChange'] = useMemoizedFn(v => {
		setFilterTags(v)
	})

	const onChangeSort: SelectProps['onChange'] = useMemoizedFn((_, options) => {
		setSortParams((options as Array<DefaultOptionType>).map(item => item.data))
	})

	return (
		<div className={$cx(styles._local)}>
			<Row gutter={12}>
				<Col span={6}>
					<Select
						className='w_100'
						popupClassName='borderless'
						mode='multiple'
						variant='filled'
						showSearch={false}
						allowClear
						placeholder={
							t('common.select') + t('common.letter_space') + t('common.angles.label')
						}
						fieldNames={{ label: 'text', value: 'id' }}
						disabled={unpaid}
						options={angles}
						value={analysis_filter_angles}
						onChange={onChangeAngles}
					></Select>
				</Col>
				<Col span={6}>
					<Select
						className='w_100'
						popupClassName='borderless'
						mode='multiple'
						variant='filled'
						showSearch={false}
						allowClear
						placeholder={t('common.select') + t('common.letter_space') + t('common.tags.label')}
						fieldNames={{ label: 'text', value: 'id' }}
						disabled={unpaid}
						options={tags}
						value={analysis_filter_tags}
						onChange={onChangetags}
					></Select>
				</Col>
				<Col span={6}>
					<Select
						className='w_100'
						popupClassName='borderless'
						mode='multiple'
						variant='filled'
						showSearch={false}
						allowClear
						placeholder={t('common.letter_space') + t('todo.Analysis.sort_by')}
						options={options_sort}
						fieldNames={{ label: 'value' }}
						disabled={unpaid}
						value={(analysis_sort_params || []).map(item => `${item.type} (${item.order})`)}
						onChange={onChangeSort}
					></Select>
				</Col>
				<Col span={6}>
					<Select
						className='w_100'
						popupClassName='borderless'
						variant='filled'
						allowClear
						placeholder={t('common.letter_space') + t('todo.Analysis.group_by')}
						disabled={unpaid}
						options={options_group}
						value={group_by}
						onChange={setGroupBy}
					></Select>
				</Col>
			</Row>
		</div>
	)
}

export default $app.memo(Index)
