import { Progress, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

import { getBlockStyle, getBlockWrapStyle } from '../../utils'

import type { IPropsTypeChart } from '../../types'

const Index = (props: IPropsTypeChart) => {
	const { index, chart_data, setIndex, setChartDom } = props
	const { items, percent, left, total_todos, max } = chart_data!
	const { t } = useTranslation()

	return (
		<div className='chart_wrap w_100 border_box flex flex_column'>
			<div className='chart_items w_100 flex'>
				<div className='cols w_100 border_box day flex flex_column' ref={setChartDom}>
					{items.map((day, idx) => (
						<div className='col week w_100 flex justify_between' key={idx}>
							{Object.keys(day).map(item => (
								<Tooltip destroyTooltipOnHide title={item} key={item}>
									<div
										className={$cx(
											'block_wrap week flex justify_center cursor_point',
											index?.index === idx &&
												index?.key === item &&
												'active'
										)}
										style={getBlockWrapStyle(day[item])}
										onClick={() => setIndex({ index: idx, key: item })}
									>
										<div
											className='block'
											style={getBlockStyle(day[item], 10)}
										></div>
									</div>
								</Tooltip>
							))}
						</div>
					))}
				</div>
				<div className='progress flex justify_center align_center'>
					<Progress type='circle' strokeColor='var(--color_text_sub)' percent={percent} size={80} />
				</div>
			</div>
			<div className='detail_wrap w_100 border_box flex'>
				{t('atoms.TodoActivity.detail', {
					type: t('common.l_this') + t('common.letter_space') + t('common.l_week'),
					unit: t('common.time.hours'),
					left,
					total: total_todos,
					max_time: max.time,
					max_count: max.count
				})}
			</div>
		</div>
	)
}

export default $app.memo(Index)
