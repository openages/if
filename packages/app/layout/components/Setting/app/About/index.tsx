import { getVersion } from '@/appdata/version'
import { Logo } from '@/components'
import { EnvelopeSimple } from '@phosphor-icons/react'

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
				<a className='media_item' href='https://github.com/openages/if_releases'>
					Github
				</a>
				<a className='media_item' href='https://discord.gg/sUYAR2B84h'>
					Discord
				</a>
				<a className='media_item' href='https://if.openages.com/privacy'>
					Privacy Policy
				</a>
				<a className='media_item' href='https://if.openages.com/terms'>
					Terms of Use
				</a>
			</div>
			<div className='statement flex flex_column align_center'>
				<span className='words text_center'>Time is the most valuable thing a man can spend.</span>
				<span className='person'>Theophrastus</span>
			</div>
			<div className='link_wrap flex absolute'>
				<a className='link_item flex align_center' href='mailto:if.support@openages.com'>
					<EnvelopeSimple className='mr_4'></EnvelopeSimple> if.support@openages.com
				</a>
			</div>
		</div>
	)
}

export default $app.memo(Index)
