import { getVersion } from '@/appdata/version'
import { Logo } from '@/components'
import { EnvelopeSimple, LinkSimpleHorizontal } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	return (
		<div className={$cx('w_100 h_100 flex flex_column align_center justify_center relative', styles._local)}>
			<Logo size={120}></Logo>
			<span className='version color_text_light mb_6'>{getVersion()}</span>
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
			<div className='link_wrap flex absolute'>
				<a className='link_item flex align_center mr_12' href='https://openages.com'>
					<LinkSimpleHorizontal className='mr_4'></LinkSimpleHorizontal> openages.com
				</a>
				<a className='link_item flex align_center' href='mailto:if.support@openages.com'>
					<EnvelopeSimple className='mr_4'></EnvelopeSimple> if.support@openages.com
				</a>
			</div>
		</div>
	)
}

export default $app.memo(Index)
