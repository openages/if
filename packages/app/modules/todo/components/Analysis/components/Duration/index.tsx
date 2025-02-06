import { Segmented } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Crown } from '@/components'
import { SquaresFour } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsAnalysisDuration } from '@/modules/todo/types'
import type { SegmentedLabeledOption } from 'antd/es/segmented'

const Index = (props: IPropsAnalysisDuration) => {
	const { unpaid, analysis_duration, total, setDuration } = props
	const { t } = useTranslation()

	const options = useMemo(() => {
		const durations = t('todo.Analysis.durations') as Array<
			SegmentedLabeledOption<IPropsAnalysisDuration['analysis_duration']>
		>

		durations.map((item, index) => {
			const should_pay = index > 1

			if (unpaid && should_pay) {
				item.label = (
					<div>
						<Crown type='card' no_bg></Crown>
						{item.label}
					</div>
				)
			}
		})

		return durations
	}, [unpaid])

	return (
		<div className={$cx('w_100 flex justify_between', styles._local)}>
			<Segmented options={options} value={analysis_duration} onChange={setDuration}></Segmented>
			<div className='total_wrap flex justify_center align_center'>
				<SquaresFour className='mr_6' size={14} weight='fill'></SquaresFour> {total}
			</div>
		</div>
	)
}

export default $app.memo(Index)
