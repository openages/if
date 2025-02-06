import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { omit } from 'lodash-es'
import { useTranslation } from 'react-i18next'

import { CellSignalHigh } from '@phosphor-icons/react'

import styles from './index.css'
import Option from './Option'

import type { IPropsLevel } from '../../types'

const options = [
	{ label: $t('common.prority.no'), value: 0 },
	{ label: $t('common.prority.low'), value: 1 },
	{ label: $t('common.prority.medium'), value: 2 },
	{ label: $t('common.prority.high'), value: 3 },
	{ label: $t('common.prority.urgent'), value: 4 }
]

const Index = (props: IPropsLevel) => {
	const { value, useByInput, onChangeLevel, onFocus, onBlur } = props
	const { t } = useTranslation()

	const optionRender = useMemoizedFn(item => <Option {...item} selected={item.value === value} key={item.value} />)
	const labelRender = useMemoizedFn(item => <Option {...omit(item, 'key')} as_label />)

	return (
		<Select
			rootClassName={$cx(
				'w_100',
				styles._local,
				useByInput && styles.useByInput,
				value && styles.has_value
			)}
			popupClassName={$cx('small', styles.popup)}
			placement='bottomLeft'
			suffixIcon={useByInput && !value ? <CellSignalHigh size={18}></CellSignalHigh> : null}
			popupMatchSelectWidth={false}
			placeholder={t('common.set') + t('common.letter_space') + t('todo.common.priority')}
			optionRender={optionRender}
			labelRender={labelRender}
			options={options}
			value={value}
			onFocus={onFocus}
			onBlur={onBlur}
			onChange={onChangeLevel}
		></Select>
	)
}

export default $app.memo(Index)
