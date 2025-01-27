import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'

import { CaretLeft, CaretRight, SquaresFour } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const { type, current, total, setType, prev, next } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex justify_between', styles._local)}>
			<Segmented
				options={[
					{ label: t('common.time.week'), value: 'week' },
					{ label: t('common.time.month'), value: 'month' },
					{ label: t('common.time.year'), value: 'year' }
				]}
				value={type}
				onChange={setType}
			></Segmented>
			<div className='option_wrap current flex align_center'>{current}</div>
			<div className='option_wrap btn flex justify_center align_center clickable' onClick={prev}>
				<CaretLeft weight='bold'></CaretLeft>
			</div>
			<div className='option_wrap btn flex justify_center align_center clickable' onClick={next}>
				<CaretRight weight='bold'></CaretRight>
			</div>
			<div className='option_wrap total flex justify_center align_center'>
				<SquaresFour className='mr_6' size={14} weight='fill'></SquaresFour> {total}
			</div>
		</div>
	)
}

export default $app.memo(Index)
