import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'

import { SquaresFour } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsAnalysisDuration } from '@/modules/todo/types'

const Index = (props: IPropsAnalysisDuration) => {
	const { analysis_duration, total, setDuration } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex justify_between', styles._local)}>
			<Segmented
				options={t('todo.Analysis.durations') as Array<IPropsAnalysisDuration['analysis_duration']>}
				value={analysis_duration}
				onChange={setDuration}
			></Segmented>
			<div className='total_wrap flex justify_center align_center'>
				<SquaresFour className='mr_6' size={14} weight='fill'></SquaresFour> {total}
			</div>
		</div>
	)
}

export default $app.memo(Index)
