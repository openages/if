import { Radio, Select, Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { locale_options, themes } from '@/appdata'
import { useGlobal } from '@/context/app'

const { Group: RadioGroup } = Radio

const Index = () => {
	const global = useGlobal()

	return (
		<Fragment>
			<span className='setting_title'>{t('translation:setting.Normal.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='title_wrap'>{t('translation:setting.Normal.language.title')}</span>
					<Select
						className='select'
						defaultValue={global.locale.lang}
						options={locale_options}
						onSelect={(v) => setLocale(v, false)}
					></Select>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='title_wrap'>{t('translation:setting.Normal.theme.title')}</span>
					<Select
						className='select'
						defaultValue={global.setting.theme}
						options={themes.map((item) => ({
							label: l(`setting.Normal.theme.options.${item}`),
							value: item
						}))}
						onSelect={(v) => global.setting.setTheme(v)}
					></Select>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='title_wrap'>{t('translation:setting.Normal.show_bar_title.title')}</span>
                              <RadioGroup
                                    className='radio_wrap flex align_center justify_center'
						defaultValue={global.setting.show_bar_title}
						options={[
							{ label: t('translation:setting.Normal.show_bar_title.options.hide'), value: false },
							{ label: t('translation:setting.Normal.show_bar_title.options.show'), value: true }
						]}
						onChange={({ target: { value } }) => (global.setting.show_bar_title = value)}
					></RadioGroup>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='title_wrap'>{t('translation:setting.Normal.page_width.title')}</span>
                              <RadioGroup
                                    className='radio_wrap flex align_center justify_center'
						defaultValue={global.setting.page_width}
						options={[
							{ label: t('translation:setting.Normal.page_width.options.unlimited'), value: '100%' },
							{ label: t('translation:setting.Normal.page_width.options.limited'), value: '780px' }
						]}
						onChange={({ target: { value } }) => global.setting.setPageWidth(value)}
					></RadioGroup>
				</div>
			</div>
		</Fragment>
	)
}

export default new window.$app.handle(Index).by(observer).by(window.$app.memo).get()
