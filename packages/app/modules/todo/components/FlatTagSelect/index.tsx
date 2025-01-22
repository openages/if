import { Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'

const Index = (props: IPropsTagSelect) => {
	const { options, value, className, placement, unlimit, onChange, onFocus } = props
	const { t } = useTranslation()
	const global = useGlobal()
	const theme = global.setting.theme

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, { theme })
	}, [options, theme])

	return (
		<div className={$cx('flex align_center', className)}>
			<Select
				className={$cx('no_suffix', styles._local)}
				popupClassName={styles.popup}
				mode='tags'
				placement={placement || 'bottomRight'}
				fieldNames={{ label: 'text', value: 'id' }}
				variant='borderless'
				showSearch={false}
				virtual={false}
				getPopupContainer={() => document.body}
				placeholder={t('todo.Input.tag_placeholder')}
				tagRender={Tag!}
				suffixIcon={null}
				maxCount={unlimit ? 30 : 3}
				options={options}
				value={value}
				optionRender={option => (
					<div className='select_item flex align_center'>
						<span className='color' style={{ backgroundColor: option.data.color }}></span>
						<span className='text'>{option.label}</span>
					</div>
				)}
				onDropdownVisibleChange={onFocus}
				onChange={onChange}
			></Select>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
