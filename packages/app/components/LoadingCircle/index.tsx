import { Loader2 } from 'lucide-react'

import styles from './index.css'

interface IProps {
	className?: HTMLDivElement['className']
	size?: number
	color?: string
}

const Index = (props: IProps) => {
	const { className, size = 48, color = 'var(--color_text)' } = props

	return (
		<div className={$cx('flex', styles._local, className)} style={{ width: size, height: size }}>
			<Loader2 className='w_100 h_100' strokeWidth={1} color={color}></Loader2>
		</div>
	)
}

export default $app.memo(Index)
