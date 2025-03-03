import { useMemoizedFn } from 'ahooks'

import type { IPropsCalendarDay } from '../../types'
import type { Extra } from '@/modules/schedule/utils/getDayDetails'

const Index = (props: IPropsCalendarDay) => {
	const { item, current, changeCurrentDate } = props

	const onChangeCurrentDate = useMemoizedFn(() => changeCurrentDate(item.value))

	return (
		<div
			className={$cx(
				'day_wrap flex flex_column align_center clickable',
				!item.is_current_month && 'not_current_month',
				current && 'current',
				item.is_today && 'today'
			)}
			onClick={onChangeCurrentDate}
		>
			<span className='date'>{item.date}</span>
			<Choose>
				<When condition={!!item.global_festival}>
					<span className='holiday'>{(item.global_festival as string).substring(0, 5)}</span>
				</When>
				<Otherwise>
					<Choose>
						<When condition={!!item.extra}>
							<span className='extra'>
								<Choose>
									<When condition={(item.extra as Extra).target}>
										{(item.extra as Extra).holiday}
									</When>
									<Otherwise>
										<span className='extra'>{item.lunar}</span>
									</Otherwise>
								</Choose>
								<If condition={(item.extra as Extra).work !== undefined}>
									<Choose>
										<When condition={(item.extra as Extra).work}>
											<span className='status work absolute'>班</span>
										</When>
										<Otherwise>
											<span className='status relax absolute'>休</span>
										</Otherwise>
									</Choose>
								</If>
							</span>
						</When>
						<Otherwise>
							<span className='extra'>{item.lunar}</span>
						</Otherwise>
					</Choose>
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
