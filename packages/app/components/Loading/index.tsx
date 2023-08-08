import { Logo } from '@/components'
import { local } from '@matrixages/knife/storage'

import styles from './loading.css'

const Index = () => {
	return (
		<div
			className={$cx(
				'w_100vw h_100vh fixed top_0 left_0 flex justify_center align_center',
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
		</div>
	)
}

export default Index
