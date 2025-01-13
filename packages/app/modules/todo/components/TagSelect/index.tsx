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
	const {
		options,
		value,
		useByTodo,
		useByDetail,
		useByTable,
		className,
		placement,
		unlimit,
		show_suffix,
		onChange,
		onFocus
	} = props
	const { t } = useTranslation()
	const global = useGlobal()
	const theme = global.setting.theme

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, { useByTodo: useByTodo || useByTable, theme })
	}, [options, useByTodo, useByTable, theme])

	const props_extra = {} as SelectProps

	if (!show_suffix) props_extra['suffixIcon'] = null

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
				showSearch={false}
				virtual={false}
				getPopupContainer={() => document.body}
				placeholder={t('todo.Input.tag_placeholder')}
				tagRender={Tag!}
				maxCount={unlimit ? 30 : 3}
				options={options}
				value={value}
				onDropdownVisibleChange={onFocus}
				onChange={onChange}
				{...props_extra}
			></Select>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
