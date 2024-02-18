import { useMemoizedFn } from 'ahooks'
import { DatePicker } from 'antd'

import { CaretLeft, CaretRight } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderCenter } from '../../../../types'

const Index = (props: IPropsHeaderCenter) => {
	const { current, step } = props

	const prev = useMemoizedFn(() => step('prev'))
	const next = useMemoizedFn(() => step('next'))

	return (
		<div className={$cx('flex', styles._local)}>
			<div className='btn btn_prev flex justify_center align_center clickable' onClick={prev}>
				<CaretLeft></CaretLeft>
			</div>
			<DatePicker
				className='datepicker'
				picker='week'
				popupAlign={{ offset: [-60] }}
				variant='borderless'
				allowClear={false}
				suffixIcon={null}
				value={current}
			></DatePicker>
			<div className='btn btn_prev flex justify_center align_center clickable' onClick={next}>
				<CaretRight></CaretRight>
			</div>
		</div>
	)
}

export default $app.memo(Index)
