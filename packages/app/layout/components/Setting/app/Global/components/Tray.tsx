import { useMemoizedFn } from 'ahooks'
import { Select, Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { updateModuleGlobalSetting } from '@/actions/global'
import { locale_options } from '@/appdata'
import { ModuleIcon } from '@/components'
import { useCreateLayoutEffect } from '@/hooks'
import { SettingsModel } from '@/models'

import type { Tray } from '@/types'

const Index = () => {
	const [x] = useState(() => new SettingsModel<Tray.Setting>())
	const { t } = useTranslation()

	useCreateLayoutEffect(() => {
		x.init('tray_settings')

		return () => x.off()
	}, [])

	// const onChangeSound = useMemoizedFn((v: boolean) => {
	// 	x.settings.sound = v

	// 	updateModuleGlobalSetting('pomo_settings', { sound: v } as Partial<Tray.Setting>)
	// })

	return (
		<Fragment>
			<span className='setting_title'>{t('setting.Tray.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<ModuleIcon type='todo' size={24}></ModuleIcon>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('setting.Tray.Todo.title')}</span>
							<span className='desc'>{t('setting.Tray.Todo.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Select
							className='select'
							value={global.locale.lang}
							options={locale_options}
							onSelect={v => {
								global.locale.setLang(v)

								changeLanguage(v)
							}}
						></Select>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<ModuleIcon type='schedule' size={24}></ModuleIcon>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('setting.Tray.Schedule.title')}</span>
							<span className='desc'>{t('setting.Tray.Schedule.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Switch
							value={global.setting.browser_mode}
							onChange={v => (global.setting.browser_mode = v)}
						></Switch>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default new window.$app.handle(Index).by(observer).by(window.$app.memo).get()
