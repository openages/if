import { is_mas_id } from '@/utils'
import {
	Activity,
	Butterfly,
	Cloud,
	Command,
	CurrencyCircleDollar,
	HandHeart,
	Heart,
	Info,
	Layout,
	Medal,
	Sliders,
	User,
	Users,
	YoutubeLogo
} from '@phosphor-icons/react'

import { About, Account, Global, Menu, Paid, Shortcuts, Tasks, Tutorial } from './app'
import { Note } from './modules'

import type { TFunction } from 'i18next'
import type { Icon } from '@phosphor-icons/react'

export const getSettingItems = (t: TFunction<'translation', undefined>) => {
	const target = [
		{
			label: t('setting.nav.titles.Global'),
			Icon: Sliders,
			key: 'global',
			children: <Global></Global>
		},
		{
			label: t('setting.nav.titles.Account'),
			Icon: User,
			key: 'account',
			children: <Account></Account>
		},
		is_mas_id && {
			label: t('setting.nav.titles.Paid'),
			Icon: CurrencyCircleDollar,
			key: 'paid',
			children: <Paid></Paid>
		},
		// {
		// 	label: t('setting.nav.titles.Menu'),
		// 	Icon: Layout,
		// 	key: 'menu',
		// 	children: <Menu></Menu>
		// },
		{
			label: t('setting.nav.titles.Tasks'),
			Icon: Activity,
			key: 'tasks',
			children: <Tasks></Tasks>
		},
		{
			label: t('setting.nav.titles.Shortcuts'),
			Icon: Command,
			key: 'shortcuts',
			children: <Shortcuts></Shortcuts>
		},
		{
			label: t('setting.nav.titles.Tutorial'),
			Icon: YoutubeLogo,
			key: 'tutorial',
			children: <Tutorial></Tutorial>
		},
		{
			label: t('setting.nav.titles.About'),
			Icon: Info,
			key: 'about',
			children: <About></About>
		}
	]

	return target.filter(item => item) as Array<{
		label: string
		Icon: Icon
		key: string
		children: JSX.Element
	}>
}

export const getModuleItems = (t: TFunction<'translation', undefined>) => [
	{
		label: t('modules.note'),
		key: 'note',
		children: <Note></Note>
	}
]

export const UserTypeIcon = {
	free: Heart,
	pro: Butterfly,
	max: Cloud,
	sponsor: HandHeart,
	gold_sponsor: Medal,
	team: Users
}
