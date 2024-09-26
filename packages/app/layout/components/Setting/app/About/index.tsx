import { getVersion } from '@/appdata/version'
import { Logo } from '@/components'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 h_100 flex flex_column align_center justify_center', styles._local)}>
			<Logo size={120}></Logo>
			<span className='version color_text_light mb_6'>{getVersion()}</span>
			<a className='email mb_4' href='mailto:if.support@openages.com'>
				if.support@openages.com
			</a>
			<div className='media_wrap flex'>
				<a className='media_item' href='https://if.openages.com'>
					Website
				</a>
				<a className='media_item' href='https://www.reddit.com/r/ifinity/'>
					Reddit
				</a>
				<a className='media_item' href='https://x.com/_ifapp_'>
					X(Twitter)
				</a>
				<a className='media_item' href='https://if.openages.com/privacy'>
					Privacy Policy
				</a>
				<a
					className='media_item'
					href='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
				>
					Terms of Use
				</a>
			</div>
			<div className='statement flex flex_column align_center'>
				<span className='words text_center'>Time is the most valuable thing a man can spend.</span>
				<span className='person'>Theophrastus</span>
			</div>
		</div>
	)
}

export default $app.memo(Index)
