import { useMemoizedFn } from 'ahooks'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { CaretLeft, CaretRight } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderCenter } from '../../../../types'
import type { DatePickerProps } from 'antd'

const Footer = $app.memo(({ changeCurrent }: { changeCurrent: IPropsHeaderCenter['changeCurrent'] }) => {
	const { t } = useTranslation()

	const setCurrentWeek = useMemoizedFn(() => changeCurrent(dayjs()))

	return (
		<div className='w_100 clickable' onClick={setCurrentWeek}>
			{t('translation:common.current_week')}
		</div>
	)
})

const Index = (props: IPropsHeaderCenter) => {
	const { scale, current, step, changeCurrent } = props
	const props_datepicker: DatePickerProps = {}

	const prev = useMemoizedFn(() => step('prev'))
	const next = useMemoizedFn(() => step('next'))
	const renderExtraFooter = useMemoizedFn(() => <Footer changeCurrent={changeCurrent} />)

	if (scale === 'week') props_datepicker['renderExtraFooter'] = renderExtraFooter

	return (
		<div className={$cx('flex', styles._local)}>
			<div className='btn_std btn_prev flex justify_center align_center clickable' onClick={prev}>
				<CaretLeft></CaretLeft>
			</div>
			<DatePicker
				className='datepicker'
				picker='week'
				popupAlign={{ offset: [-66] }}
				variant='borderless'
				allowClear={false}
				suffixIcon={null}
				showWeek
				format='YYYY-MM-DD'
				value={current}
				onChange={changeCurrent}
				{...props_datepicker}
			></DatePicker>
			<div className='btn_std btn_prev flex justify_center align_center clickable' onClick={next}>
				<CaretRight></CaretRight>
			</div>
		</div>
	)
}

export default $app.memo(Index)
