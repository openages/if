interface IProps {
	className?: HTMLDivElement['className']
	size?: number
	color?: string
}

const Index = (props: IProps) => {
	const { className, size = 48, color = 'var(--color_main)' } = props

	return (
		<div className={$cx('flex', className)} style={{ width: size, height: size, fill: color }}>
			<svg xmlns='http://www.w3.org/2000/svg' width='300' height='100%' viewBox='0 0 300 300'>
				<g id='i'>
					<g id='组_4' data-name='组 4'>
						<rect
							id='矩形_3_拷贝_9'
							data-name='矩形 3 拷贝 9'
							className='cls-1'
							x='47'
							y='46'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_10'
							data-name='矩形 3 拷贝 10'
							className='cls-1'
							x='47'
							y='88'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_11'
							data-name='矩形 3 拷贝 11'
							className='cls-1'
							x='47'
							y='130'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_12'
							data-name='矩形 3 拷贝 12'
							className='cls-1'
							x='47'
							y='172'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_13'
							data-name='矩形 3 拷贝 13'
							className='cls-1'
							x='47'
							y='214'
							width='40'
							height='40'
						/>
					</g>
				</g>
				<g id='f'>
					<g id='组_3' data-name='组 3'>
						<rect
							id='矩形_3_拷贝_2'
							data-name='矩形 3 拷贝 2'
							className='cls-1'
							x='129'
							y='46'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_3'
							data-name='矩形 3 拷贝 3'
							className='cls-1'
							x='129'
							y='88'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_4'
							data-name='矩形 3 拷贝 4'
							className='cls-1'
							x='129'
							y='130'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_7'
							data-name='矩形 3 拷贝 7'
							className='cls-1'
							x='129'
							y='172'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_8'
							data-name='矩形 3 拷贝 8'
							className='cls-1'
							x='129'
							y='214'
							width='40'
							height='40'
						/>
					</g>
					<g id='组_2' data-name='组 2'>
						<rect
							id='矩形_3_拷贝_5'
							data-name='矩形 3 拷贝 5'
							className='cls-1'
							x='171'
							y='130'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝_6'
							data-name='矩形 3 拷贝 6'
							className='cls-1'
							x='213'
							y='130'
							width='40'
							height='40'
						/>
					</g>
					<g id='组_1' data-name='组 1'>
						<rect
							id='矩形_3'
							data-name='矩形 3'
							className='cls-1'
							x='171'
							y='46'
							width='40'
							height='40'
						/>
						<rect
							id='矩形_3_拷贝'
							data-name='矩形 3 拷贝'
							className='cls-1'
							x='213'
							y='46'
							width='40'
							height='40'
						/>
					</g>
				</g>
			</svg>
		</div>
	)
}

export default $app.memo(Index)
