import { useTranslation } from 'react-i18next'

import styles from './index.css'
import videos from './videos'

const Index = () => {
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100', styles._local)}>
			<div className='video_items flex flex_wrap'>
				{videos.map(item => (
					<div className='video_item_wrap border_box'>
						<div className='video_item flex flex_column'>
							<video className='video' controls src={item.src} key={item.title}></video>
							<h3>{t(`setting.Tutotial.${item.title}`)}</h3>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
