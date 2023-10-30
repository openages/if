import { Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import getTag from './getTag'
import styles from './index.css'

import type { IPropsTagSelect } from '../../types'

const Index = (props: IPropsTagSelect) => {
	const { options, value, useByTodo, className, placement, onChange } = props
	const { t } = useTranslation()

	const Tag = useMemo(() => {
		if (!options || !options?.length) return null

		return getTag(options, useByTodo)
	}, [options, useByTodo])

	return (
		<Select
			className={$cx('borderless no_suffix', styles._local, className, useByTodo && styles.useByTodo)}
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
			onChange={onChange}
		></Select>
	)
}

export default $app.memo(Index)
