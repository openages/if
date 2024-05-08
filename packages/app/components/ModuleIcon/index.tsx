import { match } from 'ts-pattern'

import {
	AppWindow,
	Barbell,
	CalendarCheck,
	ChartBarHorizontal,
	CheckCircle,
	Clipboard,
	Database,
	GearSix,
	MarkdownLogo,
	MicrosoftPowerpointLogo,
	NoteBlank,
	Table,
	TextColumns,
	Timer,
	TreeStructure,
	WebhooksLogo
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
		.with('memo', () => <NoteBlank {...icon_props} />)
		.with('note', () => (
			<MarkdownLogo {...icon_props} size={icon_props.size ? Number(icon_props.size) - 3 : '1em'} />
		))
		.with('page', () => <AppWindow {...icon_props} />)
		.with('whiteboard', () => <Clipboard {...icon_props} />)
		.with('ppt', () => <MicrosoftPowerpointLogo {...icon_props} />)
		.with('pomo', () => <Timer {...icon_props} />)
		.with('schedule', () => <CalendarCheck {...icon_props} />)
		.with('flag', () => <Barbell {...icon_props} />)
		.with('table', () => <Table {...icon_props} />)
		.with('form', () => <TextColumns {...icon_props} />)
		.with('chart', () => <ChartBarHorizontal {...icon_props} />)
		.with('api', () => <WebhooksLogo {...icon_props} />)
		.with('dataflow', () => <TreeStructure {...icon_props} />)
		.with('database', () => <Database {...icon_props} />)
		.with('setting', () => <GearSix {...icon_props} />)
		.exhaustive()
}

export default $app.memo(Index)
