import { Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'

const Index = (props: IPropsTagSelect) => {
	const { options, value, useByTodo, useByDetail, kanban_mode, className, placement, onChange } = props
	const { t } = useTranslation()

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, { useByTodo })
	}, [options, useByTodo])

	return (
		<div className={$cx('flex', className)}>
			<Select
				className={$cx(
					'borderless no_suffix',
					styles._local,
					useByTodo && styles.useByTodo,
					useByDetail && styles.useByDetail,
					kanban_mode && styles.kanban_mode
				)}
				popupClassName='borderless'
				size='small'
				mode='tags'
				placement={placement || 'topLeft'}
				fieldNames={{ label: 'text', value: 'id' }}
				bordered={false}
				virtual={false}
				suffixIcon={null}
				getPopupContainer={() => document.body}
				placeholder={t('translation:todo.Input.tag_placeholder')}
				tagRender={Tag}
				options={options}
				value={value}
				onChange={v => onChange(v)}
			></Select>
		</div>
	)
}

export default $app.memo(Index)
