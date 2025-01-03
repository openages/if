import { CircleArrowUp, Info, Settings2, SquareChevronUp, UserRound } from 'lucide-react'

import {
	Butterfly,
	Cloud,
	CurrencyCircleDollar,
	HandHeart,
	Heart,
	Medal,
	Sliders,
	User,
	Users
} from '@phosphor-icons/react'

import { About, Account, Billing, Global, Menu, Shortcuts } from './app'
import { Note } from './modules'

import type { TFunction } from 'i18next'
import type { LucideIcon } from 'lucide-react'

export const getSettingItems = (t: TFunction<'translation', undefined>) => {
	const target = [
		{
			label: t('setting.nav.titles.Global'),
			Icon: Settings2,
			key: 'global',
			children: <Global></Global>
		},
		{
			label: t('setting.nav.titles.Account'),
			Icon: UserRound,
			key: 'account',
			children: <Account></Account>
		},
		{
			label: t('setting.nav.titles.Billing'),
			Icon: CircleArrowUp,
			key: 'billing',
			children: <Billing></Billing>
		},
		// {
		// 	label: t('setting.nav.titles.Menu'),
		// 	Icon: Layout,
		// 	key: 'menu',
		// 	children: <Menu></Menu>
		// },
		{
			label: t('setting.nav.titles.Shortcuts'),
			Icon: SquareChevronUp,
			key: 'shortcuts',
			children: <Shortcuts></Shortcuts>
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
		Icon: LucideIcon
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
