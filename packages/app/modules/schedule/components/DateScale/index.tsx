import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then, When } from 'react-if'

import { getStaticWeekdays } from '@/modules/schedule/utils'

import styles from './index.css'

import type { IPropsDateScale } from '../../types'

const Index = (props: IPropsDateScale) => {
	const { scale, weekdays } = props
	const { i18n } = useTranslation()
	const is_zh = i18n.language === 'zh'

	const target_weekdays = useMemo(() => {
		if (scale === 'day') return []

		return scale === 'week' ? weekdays : getStaticWeekdays()
	}, [scale, weekdays])

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			{target_weekdays.map((item, index) => (
				<div
					className={$cx(
						'weekday_item border_box flex justify_between align_center',
						item.is_today && 'today'
					)}
					key={index}
				>
					<div className='flex align_center'>
						<span className='weekday mr_6'>{item.weekday}</span>
						<span className='date'>{item.date}</span>
					</div>
					<When condition={is_zh && scale === 'week'}>
						<If condition={!!item.extra}>
							<Then>
								<div className='extra_wrap'>
									<If condition={item.extra.target}>
										<Then>
											<span className='holiday'>{item.extra.holiday}</span>
										</Then>
										<Else>
											<If condition={item.extra.work}>
												<Then>
													<span className='status work'>班</span>
												</Then>
												<Else>
													<span className='status relax'>休</span>
												</Else>
											</If>
										</Else>
									</If>
								</div>
							</Then>
							<Else>
								<span className='lunar'>{item.lunar}</span>
							</Else>
						</If>
					</When>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
