import { match } from 'ts-pattern'

import {
	Barbell,
	CalendarCheck,
	ChartBarHorizontal,
	CheckCircle,
	Clipboard,
	HourglassMedium,
	Kanban,
	MicrosoftPowerpointLogo,
	Note,
	Notebook,
	Path,
	Table,
	TextColumns,
	TreeStructure,
	GridNine,
	Keyboard,
	ProjectorScreenChart,
	GearSix
} from '@phosphor-icons/react'

import type { IconProps } from '@phosphor-icons/react'
import type { App } from '@/types'

interface IProps extends IconProps {
	type: App.ModuleType
}

const Index = (props: IProps) => {
	const { type, ...icon_props } = props

	return match(type)
		.with('todo', () => <CheckCircle {...icon_props} />)
		.with('memo', () => <Note {...icon_props} />)
		.with('note', () => <Notebook {...icon_props} />)
		.with('kanban', () => <Kanban {...icon_props} />)
		.with('flow', () => <Path {...icon_props} />)
		.with('whiteboard', () => <Clipboard {...icon_props} />)
		.with('table', () => <Table {...icon_props} />)
		.with('form', () => <TextColumns {...icon_props} />)
		.with('chart', () => <ChartBarHorizontal {...icon_props} />)
		.with('ppt', () => <MicrosoftPowerpointLogo {...icon_props} />)
		.with('schedule', () => <CalendarCheck {...icon_props} />)
		.with('pomodoro', () => <HourglassMedium {...icon_props} />)
		.with('habbit', () => <Barbell {...icon_props} />)
		.with('api', () => <TreeStructure {...icon_props} />)
		.with('metatable', () => <GridNine {...icon_props} />)
		.with('metaform', () => <Keyboard {...icon_props} />)
		.with('metachart', () => <ProjectorScreenChart {...icon_props} />)
		.with('setting', () => <GearSix {...icon_props} />)
		.exhaustive()
}

export default $app.memo(Index)
