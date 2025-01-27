import { getBlockStyle } from '../../utils'

import type { IPropsTypeChart } from '../../types'

const Index = (props: IPropsTypeChart) => {
	const { index, chart_items, setIndex } = props

	return (
		<div className='chart_wrap w_100 border_box flex'>
			{chart_items!.map((day, index) => (
				<div className='col month flex flex_column' key={index}>
					{Object.keys(day).map(item => (
						<div className='block_wrap month flex justify_center' key={item}>
							<div
								className={$cx('block', item.indexOf('~') !== -1 && 'hide')}
								style={getBlockStyle(day[item], 24)}
							></div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
