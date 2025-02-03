import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'

const Index = (props: IPropsTagSelect) => {
	const { options, value, className, placement, unlimit, wrap, useByKanban, onChange, onFocus } = props
	const { t } = useTranslation()
	const global = useGlobal()
	const theme = global.setting.theme

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, { theme })
	}, [options, theme])

	const optionRender = useMemoizedFn(option => (
		<div className='select_item flex align_center'>
			<span className='color' style={{ backgroundColor: option.data.color }}></span>
			<span className='text'>{option.label}</span>
		</div>
	))

	return (
		<div className={$cx('flex align_center', className)}>
			<Select
				className={$cx(
					'no_suffix',
					styles._local,
					wrap && styles.wrap,
					useByKanban && styles.useByKanban
				)}
				popupClassName={styles.popup}
				mode='tags'
				placement={placement || (useByKanban ? 'bottomLeft' : 'bottomRight')}
				fieldNames={{ label: 'text', value: 'id' }}
				variant='borderless'
				showSearch={false}
				virtual={false}
				getPopupContainer={() => document.body}
				placeholder={t('common.add') + t('common.letter_space') + t('todo.Input.tag_placeholder')}
				tagRender={Tag!}
				suffixIcon={null}
				maxCount={unlimit ? 30 : 3}
				options={options}
				optionRender={optionRender}
				onDropdownVisibleChange={onFocus}
				value={value}
				onChange={onChange}
			></Select>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
