import { useMemoizedFn } from 'ahooks'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { CaretLeft, CaretRight } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderCenter } from '../../../../types'
import type { DatePickerProps } from 'antd'

interface IPropsFooter {
	scale: IPropsHeaderCenter['scale']
	changeCurrent: IPropsHeaderCenter['changeCurrent']
}

const Footer = $app.memo(({ scale, changeCurrent }: IPropsFooter) => {
	const { t } = useTranslation()

	const setCurrentWeek = useMemoizedFn(() => changeCurrent(dayjs()))

	return (
		<div className='w_100 clickable' onClick={setCurrentWeek}>
			{scale === 'month' ? t('translation:common.current_month') : t('translation:common.current_week')}
		</div>
	)
})

const Index = (props: IPropsHeaderCenter) => {
	const { scale, current, step, changeCurrent } = props
	const props_datepicker: DatePickerProps = {}

	const prev = useMemoizedFn(() => step('prev'))
	const next = useMemoizedFn(() => step('next'))
	const renderExtraFooter = useMemoizedFn(() => <Footer scale={scale} changeCurrent={changeCurrent} />)

	if (scale === 'week' || scale === 'month') props_datepicker['renderExtraFooter'] = renderExtraFooter

	const picker = useMemo(() => {
		return match(scale)
			.with('day', () => ({ value: 'date', offset: -51 }))
			.with('week', () => ({ value: 'week', offset: -66 }))
			.with('month', () => ({ value: 'month', offset: -40 }))
			.exhaustive()
	}, [scale])

	return (
		<div className={$cx('flex', styles._local)}>
			<div className='btn_std btn_prev flex justify_center align_center clickable' onClick={prev}>
				<CaretLeft></CaretLeft>
			</div>
			<DatePicker
				className='datepicker'
				picker={picker.value as DatePickerProps['picker']}
				popupAlign={{ offset: [picker.offset] }}
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
