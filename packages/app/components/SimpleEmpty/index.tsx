import styles from './index.css'

import type { CSSProperties } from 'react'

interface IProps {
	className?: HTMLDivElement['className']
	style?: CSSProperties
}

const Index = (props: IProps) => {
	const { className, style = {} } = props

	return (
		<div
			className={$cx('w_100 h_100 flex flex_column align_center justify_center', styles._local, className)}
			style={style}
		>
			<div className='empty_icon_wrap flex'>
				<svg width='100%' height='100%' viewBox='0 0 647.63626 632.17383'>
					<path
						d='M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z'
						transform='translate(-276.18187 -133.91309)'
						fill='rgba(var(--color_contrast_rgb), 0.06)'
					/>
					<path
						d='M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z'
						transform='translate(-276.18187 -133.91309)'
						fill='rgba(var(--color_contrast_rgb), 0.06)'
					/>
				</svg>
			</div>
		</div>
	)
}

export default $app.memo(Index)
