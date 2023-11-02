import { Rate } from 'antd'

import { Star } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsInputStar } from '../../types'

const Index = (props: IPropsInputStar) => {
	const { value, onChangeStar } = props

	return (
		<Rate
			rootClassName={styles.star}
			count={6}
			character={({ index, value }) => (
				<Star size={15} weight={value >= index + 1 ? 'duotone' : 'regular'} />
			)}
			value={value}
			onChange={onChangeStar}
		></Rate>
	)
}

export default $app.memo(Index)
