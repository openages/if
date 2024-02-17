import { DatePicker } from 'antd'

import { CaretLeft, CaretRight } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('flex', styles._local)}>
			<div className='btn btn_prev flex justify_center align_center clickable'>
				<CaretLeft></CaretLeft>
			</div>
			<DatePicker
				className='datepicker'
				picker='week'
				popupAlign={{ offset: [-60] }}
				variant='borderless'
				allowClear={false}
				suffixIcon={null}
			></DatePicker>
			<div className='btn btn_prev flex justify_center align_center clickable'>
				<CaretRight></CaretRight>
			</div>
		</div>
	)
}

export default $app.memo(Index)
