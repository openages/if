import { Activity, Command, Info, Layout, Sliders } from '@phosphor-icons/react'

import { About, Global, Menu, Shortcuts, Tasks } from './app'
import { Note } from './modules'

import type { TFunction } from 'i18next'

export const getSettingItems = (t: TFunction<'translation', undefined>) => [
	{
		label: t('translation:setting.nav.titles.Global'),
		Icon: Sliders,
		key: 'global',
		children: <Global></Global>
	},
	// {
	// 	label: t('translation:setting.nav.titles.Menu'),
	// 	Icon: Layout,
	// 	key: 'menu',
	// 	children: <Menu></Menu>
	// },
	{
		label: t('translation:setting.nav.titles.Tasks'),
		Icon: Activity,
		key: 'tasks',
		children: <Tasks></Tasks>
	},
	{
		label: t('translation:setting.nav.titles.Shortcuts'),
		Icon: Command,
		key: 'shortcuts',
		children: <Shortcuts></Shortcuts>
	},
	{
		label: t('translation:setting.nav.titles.About'),
		Icon: Info,
		key: 'about',
		children: <About></About>
	}
]

export const getModuleItems = (t: TFunction<'translation', undefined>) => [
	{
		label: t('translation:modules.note'),
		key: 'note',
		children: <Note></Note>
	}
]
