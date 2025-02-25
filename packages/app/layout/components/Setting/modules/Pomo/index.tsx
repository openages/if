import { useMemoizedFn } from 'ahooks'
import { Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { updateModuleSetting } from '@/actions/global'
import { useCreateLayoutEffect } from '@/hooks'
import { PomoSettings } from '@/models'
import { SpeakerHigh } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	const [x] = useState(() => new PomoSettings())
	const { t } = useTranslation()

	useCreateLayoutEffect(() => {
		x.init()

		return () => x.off()
	}, [])

	const onChangeSound = useMemoizedFn((v: boolean) => {
		x.settings.sound = v

		updateModuleSetting('pomo_settings', { sound: v })
	})

	return (
		<div className={$cx('flex flex_column', styles._local)}>
			<span className='setting_title'>{t('modules.pomo')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<SpeakerHigh size={24}></SpeakerHigh>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('setting.Pomo.sound.title')}</span>
							<span className='desc'>{t('setting.Pomo.sound.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Switch value={x.settings.sound} onChange={onChangeSound}></Switch>
					</div>
				</div>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
