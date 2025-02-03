import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'
import type { SelectProps } from 'antd'
const Index = (props: IPropsTagSelect) => {
	const { options, value, useByTodo, useByInput, useByTable, className, placement, unlimit, onChange, onFocus } =
		props
	const { t } = useTranslation()
	const global = useGlobal()
	const theme = global.setting.theme

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options)
	}, [options, theme])

	const props_extra = {} as SelectProps

	const optionRender = useMemoizedFn(option => (
		<div className='select_item flex align_center'>
			<span className='color' style={{ backgroundColor: option.data.color }}></span>
			<span className='text'>{option.label}</span>
		</div>
	))

	console.log(123)

	return (
		<div className={$cx('flex align_center', className)}>
			<Select
				className={$cx(
					'borderless no_suffix',
					styles._local,
					useByTodo && styles.useByTodo,
					useByInput && styles.useByInput,
					useByTable && styles.useByTable
				)}
				popupClassName={$cx('borderless', styles.popup)}
				size='small'
				mode='tags'
				placement={placement || 'topLeft'}
				fieldNames={{ label: 'text', value: 'id' }}
				variant='borderless'
				showSearch={false}
				virtual={false}
				popupMatchSelectWidth={false}
				getPopupContainer={() => document.body}
				placeholder={t('todo.Input.tag_placeholder')}
				tagRender={Tag!}
				maxCount={unlimit ? 30 : 3}
				options={options}
				optionRender={optionRender}
				onDropdownVisibleChange={onFocus}
				value={value}
				onChange={onChange}
				{...props_extra}
			></Select>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
