import { useMemoizedFn } from 'ahooks'
import { Col, Row, Select } from 'antd'
import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsAnalysisListHeader } from '@/modules/todo/types'
import type { SelectProps } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'

const options_sort_raw = [
	{ value: 'importance (asc)', data: { type: 'importance', order: 'asc' } },
	{ value: 'importance (desc)', data: { type: 'importance', order: 'desc' } },
	{ value: 'create_at (asc)', data: { type: 'create_at', order: 'asc' } },
	{ value: 'create_at (desc)', data: { type: 'create_at', order: 'desc' } },
	{ value: 'done_time (asc)', data: { type: 'done_time', order: 'asc' } },
	{ value: 'done_time (desc)', data: { type: 'done_time', order: 'desc' } }
] as Array<DefaultOptionType>

const options_group = [
	{ label: 'angle', value: 'angle' },
	{ label: 'tag', value: 'tag' }
]

const Index = (props: IPropsAnalysisListHeader) => {
	const {
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
						placeholder='选择分类'
						options={angles}
						fieldNames={{ label: 'text', value: 'id' }}
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
						placeholder='选择标签'
						options={tags}
						fieldNames={{ label: 'text', value: 'id' }}
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
						placeholder='选择排序方式'
						options={options_sort}
						fieldNames={{ label: 'value' }}
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
						placeholder='选择分组方式'
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
