interface IProps {
	className?: HTMLDivElement['className']
	size?: number
	color?: string
}

const Index = (props: IProps) => {
	const { className, size = 48, color = 'var(--color_text)' } = props

	return (
		<div className={$cx('flex', className)} style={{ width: size, height: size, fill: color }}>
			<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 38 38'>
				<g fill='none'>
					<g transform='translate(1 1)'>
						<path d='M36 18c0-9.94-8.06-18-18-18' stroke={color} strokeWidth='1'>
							<animateTransform
								attributeName='transform'
								type='rotate'
								from='0 18 18'
								to='360 18 18'
								dur='0.9s'
								repeatCount='indefinite'
							/>
						</path>
					</g>
				</g>
			</svg>
		</div>
	)
}

export default $app.memo(Index)
