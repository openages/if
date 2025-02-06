import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'

import { Crown } from '@/components'
import { CaretLeft, CaretRight, ShareFat, SquaresFour } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const { unpaid, type, current, total, setType, reset, prev, next, share } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex justify_between', styles._local)}>
			<Segmented
				options={[
					{ label: t('common.today'), value: 'day' },
					{ label: t('common.time.week'), value: 'week' },
					{
						label: unpaid ? (
							<div>
								<Crown type='card' no_bg></Crown>
								{t('common.time.month')}
							</div>
						) : (
							t('common.time.month')
						),
						value: 'month'
					},
					{
						label: unpaid ? (
							<div>
								<Crown type='card' no_bg></Crown>
								{t('common.time.year')}
							</div>
						) : (
							t('common.time.year')
						),
						value: 'year'
					}
				]}
				value={type}
				onChange={setType}
			></Segmented>
			<div className='option_wrap current flex align_center clickable' onClick={reset}>
				{current}
			</div>
			<div className='option_wrap btn flex justify_center align_center clickable' onClick={prev}>
				<CaretLeft weight='bold'></CaretLeft>
			</div>
			<div className='option_wrap btn flex justify_center align_center clickable' onClick={next}>
				<CaretRight weight='bold'></CaretRight>
			</div>
			<div className='option_wrap btn flex justify_center align_center clickable' onClick={share}>
				<ShareFat weight='bold'></ShareFat>
			</div>
			<div className='option_wrap total flex justify_center align_center'>
				<SquaresFour className='mr_6' size={14} weight='fill'></SquaresFour> {total}
			</div>
		</div>
	)
}

export default $app.memo(Index)
