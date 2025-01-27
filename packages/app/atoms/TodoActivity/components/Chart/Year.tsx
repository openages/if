import { getBlockStyle } from '../../utils'

import type { IPropsTypeChart } from '../../types'

const Index = (props: IPropsTypeChart) => {
	const { index, chart_items, setIndex } = props

	return (
		<div className='chart_wrap w_100 border_box flex flex_column'>
			{chart_items!.map((day, index) => (
				<div className='col year flex' key={index}>
					{Object.keys(day).map(item => (
						<div className='block_wrap year flex justify_center' key={item}>
							<div className='block' style={getBlockStyle(day[item], 30)}></div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
