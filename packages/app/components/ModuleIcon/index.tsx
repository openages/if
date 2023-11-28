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
	GearSix,
	WebhooksLogo,
	FileText
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
		.with('typed', () => <FileText {...icon_props} />)
		.with('note', () => <Notebook {...icon_props} />)
		.with('kanban', () => <Kanban {...icon_props} />)
		.with('workflow', () => <Path {...icon_props} />)
		.with('whiteboard', () => <Clipboard {...icon_props} />)
		.with('ppt', () => <MicrosoftPowerpointLogo {...icon_props} />)
		.with('schedule', () => <CalendarCheck {...icon_props} />)
		.with('pomodoro', () => <HourglassMedium {...icon_props} />)
		.with('flag', () => <Barbell {...icon_props} />)
		.with('api', () => <WebhooksLogo {...icon_props} />)
		.with('dataflow', () => <TreeStructure {...icon_props} />)
		.with('table', () => <Table {...icon_props} />)
		.with('form', () => <TextColumns {...icon_props} />)
		.with('chart', () => <ChartBarHorizontal {...icon_props} />)
		.with('setting', () => <GearSix {...icon_props} />)
		.exhaustive()
}

export default $app.memo(Index)
