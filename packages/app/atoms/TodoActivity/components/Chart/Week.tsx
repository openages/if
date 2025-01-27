import { getBlockStyle } from '../../utils'

import type { IPropsTypeChart } from '../../types'

const Index = (props: IPropsTypeChart) => {
	const { index, chart_items, setIndex } = props

	return (
		<div className='chart_wrap w_100 border_box flex'>
			{chart_items!.map((day, index) => (
				<div className='col week flex flex_column' key={index}>
					{Object.keys(day).map(item => (
						<div className='block_wrap week flex justify_center' key={item}>
							<div className='block' style={getBlockStyle(day[item], 10)}></div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
