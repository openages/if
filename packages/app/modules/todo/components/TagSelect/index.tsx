import { useSize } from 'ahooks'
import { Select } from 'antd'
import { useMemo, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'

const Index = (props: IPropsTagSelect) => {
	const { options, value, useByTodo, useByDetail, className, placement, onChange, onWidth } = props
	const { t } = useTranslation()
	const tags_wrap = useRef()
	const size = useSize(tags_wrap)

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, useByTodo)
	}, [options, useByTodo])

	useEffect(() => {
		if (!onWidth) return
		if (size?.width === undefined) return

		onWidth(size.width)
	}, [size])

	return (
		<div className='flex' ref={tags_wrap}>
			<Select
				className={$cx(
					'borderless no_suffix',
					styles._local,
					className,
					useByTodo && styles.useByTodo,
					useByDetail && styles.useByDetail
				)}
				size='small'
				mode='tags'
				placement={placement || 'topLeft'}
				fieldNames={{ label: 'text', value: 'id' }}
				bordered={false}
				virtual={false}
				suffixIcon={null}
				placeholder={t('translation:todo.Input.tag_placeholder')}
				tagRender={Tag}
				options={options}
				value={value}
				onChange={(v) => onChange(v)}
			></Select>
		</div>
	)
}

export default $app.memo(Index)
