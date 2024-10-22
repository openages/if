import type { IPropsMenuLatest } from '../../types'

const Index = (props: IPropsMenuLatest) => {
	const { blocks, selectOptionAndCleanUp } = props

	return (
		<div className='latest_blocks flex align_center sticky top_0'>
			{blocks.map(item => (
				<span
					className='latest_block flex justify_center align_center clickable'
					onClick={() => selectOptionAndCleanUp(item)}
					key={item.shortcut}
				>
					{item.icon}
				</span>
			))}
		</div>
	)
}

export default $app.memo(Index)
