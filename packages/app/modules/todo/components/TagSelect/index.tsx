import { Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'

const Index = (props: IPropsTagSelect) => {
	const { options, value, useByTodo, useByDetail, useByTable, className, placement, unlimit, onChange, onFocus } =
		props
	const { t } = useTranslation()

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, { useByTodo: useByTodo || useByTable })
	}, [options, useByTodo, useByTable])

	return (
		<div className={$cx('flex', className)}>
			<Select
				className={$cx(
					'borderless no_suffix',
					styles._local,
					useByTodo && styles.useByTodo,
					(useByDetail || useByTable) && styles.useByDetail,
					useByTable && styles.useByTable
				)}
				popupClassName='borderless'
				size='small'
				mode='tags'
				placement={placement || 'topLeft'}
				fieldNames={{ label: 'text', value: 'id' }}
				variant='borderless'
				virtual={false}
				suffixIcon={null}
				getPopupContainer={() => document.body}
				placeholder={t('translation:todo.Input.tag_placeholder')}
				tagRender={Tag}
				maxCount={unlimit ? 30 : 3}
				options={options}
				value={value}
				onDropdownVisibleChange={onFocus}
				onChange={onChange}
			></Select>
		</div>
	)
}

export default $app.memo(Index)
