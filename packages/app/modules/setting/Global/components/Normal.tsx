import { useMemoizedFn } from 'ahooks'
import { Radio, Select, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { clearStorage } from '@/actions/global'
import { locale_options, themes } from '@/appdata'
import { useGlobal } from '@/context/app'
import { Circuitry, Layout, Moon, Palette, Sun, TextAa, Translate } from '@phosphor-icons/react'

const { Group: RadioGroup } = Radio

const Index = () => {
	const global = useGlobal()
	const { t, i18n } = useTranslation()
	const { changeLanguage } = i18n

	return (
		<Fragment>
			<span className='setting_title'>{t('translation:setting.Normal.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<Translate size={24}></Translate>
						<div className='text_wrap flex flex_column'>
							<span className='title'>
								{t('translation:setting.Normal.language.title')}
							</span>
							<span className='desc'>{t('translation:setting.Normal.language.desc')}</span>
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
						<Palette size={24}></Palette>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('translation:setting.Normal.theme.title')}</span>
							<span className='desc'>{t('translation:setting.Normal.theme.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Tooltip
							title={t('translation:setting.Normal.theme.auto_theme')}
							mouseEnterDelay={0.72}
							overlayStyle={{ width: 180 }}
						>
							<button
								className={$cx(
									'btn_auto_theme btn_action flex justify_center align_center clickable mr_12',
									global.setting.auto_theme && 'active'
								)}
								onClick={global.setting.toggleAutoTheme}
							>
								{global.setting.theme === 'light' ? (
									<Moon size={18}></Moon>
								) : (
									<Sun size={18}></Sun>
								)}
							</button>
						</Tooltip>
						<Select
							className='select'
							value={global.setting.theme}
							options={themes.map(item => ({
								label: t(`translation:setting.Normal.theme.options.${item}`),
								value: item
							}))}
							onSelect={v => global.setting.setTheme(v)}
						></Select>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<TextAa size={24}></TextAa>
						<div className='text_wrap flex flex_column'>
							<span className='title'>
								{t('translation:setting.Normal.show_bar_title.title')}
							</span>
							<span className='desc'>
								{t('translation:setting.Normal.show_bar_title.desc')}
							</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<RadioGroup
							className='radio_wrap flex align_center justify_end'
							value={global.setting.show_bar_title}
							options={[
								{
									label: t(
										'translation:setting.Normal.show_bar_title.options.hide'
									),
									value: false
								},
								{
									label: t(
										'translation:setting.Normal.show_bar_title.options.show'
									),
									value: true
								}
							]}
							onChange={({ target: { value } }) => (global.setting.show_bar_title = value)}
						></RadioGroup>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<Layout size={24}></Layout>
						<div className='text_wrap flex flex_column'>
							<span className='title'>
								{t('translation:setting.Normal.page_width.title')}
							</span>
							<span className='desc'>
								{t('translation:setting.Normal.page_width.desc')}
							</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<RadioGroup
							className='radio_wrap flex align_center justify_end'
							value={global.setting.page_width}
							options={[
								{
									label: t(
										'translation:setting.Normal.page_width.options.unlimited'
									),
									value: '100%'
								},
								{
									label: t('translation:setting.Normal.page_width.options.limited'),
									value: '780px'
								}
							]}
							onChange={({ target: { value } }) => global.setting.setPageWidth(value)}
						></RadioGroup>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<Circuitry size={24}></Circuitry>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('translation:common.storage')}</span>
							<span className='desc'>{t('translation:common.clear_storage_desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<button
							className='btn flex justify_center align_center clickable'
							onClick={clearStorage}
						>
							{t('translation:common.clear_storage')}
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default new window.$app.handle(Index).by(observer).by(window.$app.memo).get()
