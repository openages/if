import { Radio, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { locale_options, themes } from '@/appdata'
import { useGlobal } from '@/context/app'
import { useLocale } from '@/hooks'
import { getLocale, setLocale } from '@umijs/max'

const { Group: RadioGroup } = Radio

const Index = () => {
	const global = useGlobal()
	const locale = getLocale()
	const l = useLocale()

	return (
		<Fragment>
			<span className='setting_title'>{l('setting.Normal.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='title_wrap'>{l('setting.Normal.language.title')}</span>
					<Select
						className='select'
						defaultValue={locale}
						options={locale_options}
						onSelect={(v) => setLocale(v, false)}
					></Select>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<span className='title_wrap'>{l('setting.Normal.theme.title')}</span>
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
					<span className='title_wrap'>{l('setting.Normal.show_bar_title.title')}</span>
					<RadioGroup
						defaultValue={global.setting.show_bar_title}
						options={[
							{ label: l('setting.Normal.show_bar_title.options.hide'), value: false },
							{ label: l('setting.Normal.show_bar_title.options.show'), value: true }
						]}
						onChange={({ target: { value } }) => (global.setting.show_bar_title = value)}
					></RadioGroup>
				</div>
			</div>
		</Fragment>
	)
}

export default new window.$app.handle(Index).by(observer).by(window.$app.memo).get()
