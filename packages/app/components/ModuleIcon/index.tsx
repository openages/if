import { match } from 'ts-pattern'

import {
	CalendarCheck,
	CheckCircle,
	Clipboard,
	DiamondsFour,
	HourglassMedium,
	Kanban,
	MicrosoftPowerpointLogo,
	Note,
	Notebook,
	Path,
	ProjectorScreenChart,
	Table
} from '@phosphor-icons/react'

import type { IconProps } from '@phosphor-icons/react'
import type { App } from '@/types'

interface IProps extends IconProps {
	type: App.MuduleType
}

const Index = (props: IProps) => {
	const { type, ...icon_props } = props

	return match(type)
		.with('todo', () => <CheckCircle {...icon_props} />)
		.with('memo', () => <Note {...icon_props} />)
		.with('note', () => <Notebook {...icon_props} />)
		.with('table', () => <Table {...icon_props} />)
		.with('ppt', () => <MicrosoftPowerpointLogo {...icon_props} />)
		.with('pomodoro', () => <HourglassMedium {...icon_props} />)
		.with('widgets', () => <DiamondsFour {...icon_props} />)
		.with('schedule', () => <CalendarCheck {...icon_props} />)
		.with('kanban', () => <Kanban {...icon_props} />)
		.with('flow', () => <Path {...icon_props} />)
		.with('board', () => <Clipboard {...icon_props} />)
		.with('project', () => <ProjectorScreenChart {...icon_props} />)
		.exhaustive()
}

export default $app.memo(Index)
