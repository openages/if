import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then, When } from 'react-if'

import { getStaticWeekdays } from '@/modules/schedule/utils'
import { ArrowLineDown } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsDateScale } from '../../types'

const Index = (props: IPropsDateScale) => {
	const { scale, days, scrollToScanline } = props
	const { i18n } = useTranslation()
	const is_zh = i18n.language === 'zh'

	const target_weekdays = useMemo(() => (scale === 'month' ? getStaticWeekdays() : days), [scale, days])

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			<div className='btn_now_wrap flex justify_center align_center'>
				<div className='btn_std flex justify_center align_center clickable' onClick={scrollToScanline}>
					<ArrowLineDown></ArrowLineDown>
				</div>
			</div>
			<div className='weekday_items flex'>
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
						<If condition={item.global_festival}>
							<Then>
								<span className='holiday'>{item.global_festival}</span>
							</Then>
							<Else>
								<When condition={is_zh}>
									<If condition={!!item.extra}>
										<Then>
											<div className='extra_wrap flex align_center'>
												<If condition={item.extra.target}>
													<Then>
														<span className='holiday'>
															{item.extra.holiday}
														</span>
													</Then>
													<Else>
														<If condition={item.extra.work}>
															<Then>
																<span className='status work'>
																	班
																</span>
															</Then>
															<Else>
																<span className='status relax'>
																	休
																</span>
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
							</Else>
						</If>
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
