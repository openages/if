import { Progress } from 'antd'

import { CheckCircle } from '@phosphor-icons/react'

import styles from './index.css'

interface IProps {
	total: number
	checked: number
}

const Index = (props: IProps) => {
	const { total, checked } = props

	return (
		<div className={$cx('option_item border_box flex align_center', styles._local)}>
			{checked === total ? (
				<CheckCircle className='mr_2' size={14}></CheckCircle>
			) : (
				<Progress
					className='progress mr_4'
					type='circle'
					size={12}
					showInfo={false}
					strokeColor='rgba(var(--color_text_rgb), 0.66)'
					trailColor='rgba(var(--color_text_rgb), 0.18)'
					strokeWidth={12}
					steps={{ count: total, gap: 8 }}
					percent={(checked * 100) / total}
				></Progress>
			)}
			<span className='value_wrap'>
				{checked}/{total}
			</span>
		</div>
	)
}

export default $app.memo(Index)
