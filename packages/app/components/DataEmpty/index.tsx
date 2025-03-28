import { useEffect, useState } from 'react'

import LoadingCircle from '../LoadingCircle'
import styles from './index.css'

interface IProps {
	duration?: number
}

const Index = (props: IProps) => {
	const { duration = 0.18 } = props
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), duration * 1000)

		return () => clearTimeout(timer)
	}, [duration])

	if (!visible) return null

	return (
		<div
			className={$cx(
				'w_100 h_100 absolute top_0 left_0 z_index_1000 flex flex_column align_center justify_center',
				styles._local
			)}
		>
			<LoadingCircle></LoadingCircle>
		</div>
	)
}

export default $app.memo(Index)
