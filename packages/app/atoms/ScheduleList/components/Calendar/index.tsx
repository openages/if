import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { Lunar } from 'lunar-typescript'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getDayDetails, getStaticWeekdays } from '@/modules/schedule/utils'
import { CaretLeft, CaretRight, Circle } from '@phosphor-icons/react'

import Day from './Day'
import styles from './index.css'

import type { IPropsCalendar } from '../../types'

const weekdays = getStaticWeekdays()

const Index = (props: IPropsCalendar) => {
	const { list_current_text, calendar_month_text, days, changeCurrentDate, changeCalendarMonth } = props
	const { t, i18n } = useTranslation()
	const is_zh = i18n.language === 'zh'

	const extra = useMemo(() => {
		if (!is_zh) {
			return getDayDetails(dayjs(list_current_text)).global_festival
		}

		const lunar = Lunar.fromDate(dayjs(list_current_text).toDate())

		return `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
	}, [list_current_text, is_zh])

	const prev = useMemoizedFn(() => changeCalendarMonth('prev'))
	const current = useMemoizedFn(() => changeCalendarMonth('current'))
	const next = useMemoizedFn(() => changeCalendarMonth('next'))

	return (
		<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
			<div className='weekdays w_100 flex'>
				{weekdays.map((item, index) => (
					<span className='weekday flex justify_center' key={index}>
						{item.value.format('ddd')}
					</span>
				))}
			</div>
			<div className='days_wrap w_100 border_box flex flex_wrap'>
				{days.map((item, index) => (
					<Day
						{...{ item, changeCurrentDate }}
						current={item.value.format('YYYY-MM-DD') === list_current_text}
						key={index}
					></Day>
				))}
			</div>
			<div className='detail_wrap flex justify_between align_center w_100 border_box'>
				<div className='left_wrap flex flex_column'>
					<span className='date'>
						{dayjs(list_current_text).format(`${is_zh ? 'MM月DD日' : 'MM/DD'} dddd`)}
					</span>
					<If condition={Boolean(extra)}>
						<span className='extra'>{extra}</span>
					</If>
				</div>
				<div className='right_wrap flex align_center'>
					<span className='month'>{calendar_month_text}</span>
					<span className='divider'></span>
					<div className='actions_wrap flex'>
						<div
							className='btn_action flex justify_center align_center clickable'
							onClick={prev}
						>
							<CaretLeft></CaretLeft>
						</div>
						<div
							className='btn_action current flex justify_center align_center clickable'
							onClick={current}
						>
							<Circle weight='fill'></Circle>
						</div>
						<div
							className='btn_action flex justify_center align_center clickable'
							onClick={next}
						>
							<CaretRight></CaretRight>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
