import { useMemoizedFn } from 'ahooks'
import { DatePicker, Segmented } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { CaretLeft, CaretRight, SquaresFour } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsListHeader } from '../../../../types'

const { RangePicker } = DatePicker

const Index = (props: IPropsListHeader) => {
	const {
		list_duration,
		list_current_text,
		list_custom_duration,
		total,
		setListDuration,
		prev,
		next,
		setListCustomDuration
	} = props
	const { t } = useTranslation()

	const onChangeCustomDuration = useMemoizedFn((_, v) => {
		setListCustomDuration(v)
	})

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			<Segmented
				options={[
					{ label: t('common.today'), value: 'day' },
					{ label: t('common.time.week'), value: 'week' },
					{ label: t('common.time.month'), value: 'month' },
					{ label: t('common.time.year'), value: 'year' },
					{ label: t('common.custom'), value: 'custom' }
				]}
				value={list_duration}
				onChange={setListDuration}
			></Segmented>
			<Choose>
				<When condition={list_duration === 'custom'}>
					<RangePicker
						suffixIcon={null}
						value={
							list_custom_duration
								? [dayjs(list_custom_duration[0]), dayjs(list_custom_duration[1])]
								: null
						}
						onChange={onChangeCustomDuration}
					></RangePicker>
				</When>
				<Otherwise>
					<div className='option_wrap current flex align_center'>{list_current_text}</div>
					<div
						className='option_wrap btn flex justify_center align_center clickable'
						onClick={prev}
					>
						<CaretLeft weight='bold'></CaretLeft>
					</div>
					<div
						className='option_wrap btn flex justify_center align_center clickable'
						onClick={next}
					>
						<CaretRight weight='bold'></CaretRight>
					</div>
				</Otherwise>
			</Choose>
			<div className='option_wrap total flex justify_center align_center'>
				<SquaresFour className='mr_6' size={14} weight='fill'></SquaresFour> {total}
			</div>
		</div>
	)
}

export default $app.memo(Index)
