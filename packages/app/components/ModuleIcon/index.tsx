import { match } from 'ts-pattern'

import { Memo } from '@/icons'
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
	Table,
	TextColumns,
	Timer,
	TreeStructure,
	WebhooksLogo
} from '@phosphor-icons/react'

import styles from './index.css'

import type { IconProps } from '@phosphor-icons/react'
import type { App } from '@/types'

interface IProps extends IconProps {
	type: App.ModuleType
}

const Index = (props: IProps) => {
	const { type, className, ...icon_props } = props

	const target_class = $cx(icon_props?.weight === 'duotone' && styles._local, className)
	const target_props = { ...icon_props, className: target_class }

	return match(type)
		.with('todo', () => <CheckCircle {...target_props} />)
		.with('memo', () => <Memo {...target_props} />)
		.with('note', () => (
			<MarkdownLogo {...target_props} size={target_props.size ? Number(target_props.size) - 3 : '1em'} />
		))
		.with('page', () => <AppWindow {...target_props} />)
		.with('whiteboard', () => <Clipboard {...target_props} />)
		.with('ppt', () => <MicrosoftPowerpointLogo {...target_props} />)
		.with('pomo', () => <Timer {...target_props} />)
		.with('schedule', () => <CalendarCheck {...target_props} />)
		.with('flag', () => <Barbell {...target_props} />)
		.with('table', () => <Table {...target_props} />)
		.with('form', () => <TextColumns {...target_props} />)
		.with('chart', () => <ChartBarHorizontal {...target_props} />)
		.with('api', () => <WebhooksLogo {...target_props} />)
		.with('dataflow', () => <TreeStructure {...target_props} />)
		.with('database', () => <Database {...target_props} />)
		.with('setting', () => <GearSix {...target_props} />)
		.exhaustive()
}

export default $app.memo(Index)
