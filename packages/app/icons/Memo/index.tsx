import styles from './index.css'

import type { IconProps } from '@phosphor-icons/react'

const Index = (props: IconProps) => {
	const { className, size, weight } = props

	return (
		<svg
			className={$cx(className, weight === 'duotone' && styles._local)}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 256 256'
			width={size}
			height={size}
		>
			<rect width='256' height='256' fill='none' />
			<path
				d='M156.69,216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8V156.69a8,8,0,0,1-2.34,5.65l-51.32,51.32A8,8,0,0,1,156.69,216Z'
				fill='none'
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='16'
			/>
			<polyline
				points='215.28 159.99 160 159.99 160 215.28'
				fill='none'
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='16'
			/>
		</svg>
	)
}

export default $app.memo(Index)
