import { Progress } from 'antd'
import dayjs from 'dayjs'
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
				<div className='cols month w_100 border_box day flex justify_between' ref={setChartDom}>
					{items.map((day, idx) => (
						<div className='col month flex flex_column' key={idx}>
							{Object.keys(day).map(item => (
								<div
									className={$cx(
										'block_wrap month flex',
										item.indexOf('~') !== -1 && 'hide'
									)}
									style={getBlockWrapStyle(day[item])}
									key={item}
								>
									<div
										className={$cx(
											'block flex justify_center align_center',
											index?.index === idx &&
												index?.key === item &&
												'active'
										)}
										onClick={() => setIndex({ index: idx, key: item })}
										style={getBlockStyle(day[item], 24)}
									>
										<span
											className={$cx(
												'text w_100 h_100 flex justify_center align_center',
												typeof day[item] === 'string'
													? day[item]
													: day[item].relative_date
											)}
										>
											{item.indexOf('~') === -1 && dayjs(item).date()}
										</span>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
				<div className='progress month flex justify_center align_center'>
					<Progress
						type='circle'
						strokeColor='var(--color_text_sub)'
						percent={percent}
						size={108}
					/>
				</div>
			</div>
			<div className='detail_wrap w_100 border_box flex'>
				{t('atoms.TodoActivity.detail', {
					type: t('common.l_this') + t('common.letter_space') + t('common.l_month'),
					unit: t('common.time.days'),
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
