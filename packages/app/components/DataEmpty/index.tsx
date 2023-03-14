import { Logo } from '@/components'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 h_100vh flex flex_column align_center justify_center', styles._local)}>
			<div className='empty_icon_wrap flex'>
				<Logo size={72} color='var(--color_text_grey)'></Logo>
			</div>
		</div>
	)
}

export default $app.memo(Index)
