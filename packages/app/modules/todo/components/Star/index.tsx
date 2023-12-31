import { Rate } from 'antd'

import { getColorByLevel } from '@/appdata'
import { FireSimple } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsStar } from '../../types'

const Index = (props: IPropsStar) => {
	const { value, onChangeStar } = props
	const color = getColorByLevel(value)

	return (
		<Rate
			rootClassName={styles._local}
			count={4}
			character={({ index, value }) => (
				<FireSimple size={15} weight={value >= index + 1 ? 'duotone' : 'regular'} />
			)}
			style={{ '--color_star': color || 'var(--color_text)' }}
			value={value}
			onChange={onChangeStar}
		></Rate>
	)
}

export default $app.memo(Index)
