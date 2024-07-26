import { Logo } from '@/components'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 h_100 flex flex_column align_center justify_center', styles._local)}>
			<Logo size={150}></Logo>
			<span className='statement'>Create and design by iyasa</span>
			<div className='media_wrap flex'>
				<a className='media_item' href='https://if.openages.com' target='_blank'>
					Website
				</a>
				<a className='media_item' href='https://www.reddit.com/r/ifinity/' target='_blank'>
					Reddit
				</a>
				<a className='media_item' href='https://x.com/iyasa_hq' target='_blank'>
					X(Twitter)
				</a>
				<a className='media_item' href='https://if.openages.com/privacy' target='_blank'>
					Privacy Policy
				</a>
			</div>
		</div>
	)
}

export default $app.memo(Index)
