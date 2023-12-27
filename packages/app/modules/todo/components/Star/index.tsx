import { getColorByLevel } from '@/appdata'
import { Rate } from 'antd'

import { Star } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsStar } from '../../types'

const Index = (props: IPropsStar) => {
	const { value, onChangeStar } = props
	const color = getColorByLevel(value)

	return (
		<Rate
			rootClassName={styles._local}
			count={4}
			character={({ index, value }) => <Star size={15} weight={value >= index + 1 ? 'fill' : 'regular'} />}
			style={{ '--color_star': color || 'var(--color_text)' }}
			value={value}
			onChange={onChangeStar}
		></Rate>
	)
}

export default $app.memo(Index)
