import { Rate } from 'antd'

import { getColorByLevel } from '@/appdata'
import { FireSimple } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsLevel } from '../../types'

const Index = (props: IPropsLevel) => {
	const { value, onChangeLevel, onFocus, onBlur } = props
	const color = getColorByLevel(value!)

	return (
		<Rate
			rootClassName={styles._local}
			count={4}
			character={({ index, value }) => (
				<FireSimple size={15} weight={value! >= index! + 1 ? 'duotone' : 'regular'} />
			)}
			style={{ '--color_star': color || 'var(--color_text)' }}
			value={value}
			onChange={onChangeLevel}
			onFocus={onFocus}
			onBlur={onBlur}
		></Rate>
	)
}

export default $app.memo(Index)
