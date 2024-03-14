import type { IPropsTimelineViewDay } from '../../types'

const Index = (props: IPropsTimelineViewDay) => {
	const { index, counts } = props

	return (
		<div
			className='day_line h_100 absolute top_0'
			style={{ left: `calc(((100% / ${counts}) * ${index + 1}) - 1px)` }}
		></div>
	)
}

export default $app.memo(Index)
