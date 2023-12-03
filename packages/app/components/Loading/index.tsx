import { Logo } from '@/components'
import { local } from '@openages/stk'

import styles from './index.css'

interface IProps {
	desc?: string
}

const Index = (props: IProps) => {
	const { desc } = props

	return (
		<div
			className={$cx(
				'w_100vw h_100vh fixed top_0 left_0 flex flex_column justify_center align_center',
				styles._local,
				styles[local.theme]
			)}
		>
			<div className='loading_wrap relative'>
				<Logo
					className='loading_icon bottom w_100 h_100 absolute top_0 left_0'
					size={96}
					color='inherit'
				></Logo>
				<Logo
					className='loading_icon top w_100 h_100 absolute top_0 left_0'
					size={96}
					color='inherit'
				></Logo>
			</div>
			{desc && <span className='desc border_box text_center'>{desc}</span>}
		</div>
	)
}

export default Index
