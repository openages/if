import { omit } from 'lodash-es'
import { useMemo } from 'react'

import { Memo } from '@/icons'
import {
	AppWindow,
	Barbell,
	Browser,
	CalendarCheck,
	ChartBarHorizontal,
	CheckCircle,
	Clipboard,
	Database,
	Feather,
	FlipHorizontal,
	GearSix,
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

const icon_map = {
	todo: CheckCircle,
	memo: Memo,
	note: Feather,
	page: AppWindow,
	whiteboard: Clipboard,
	ppt: MicrosoftPowerpointLogo,
	pomo: Timer,
	schedule: CalendarCheck,
	flag: Barbell,
	table: Table,
	form: TextColumns,
	chart: ChartBarHorizontal,
	api: WebhooksLogo,
	dataflow: TreeStructure,
	database: Database,
	setting: GearSix,
	homepage: Browser,
	doc_parser: FlipHorizontal
}

const Index = (props: IProps) => {
	const { type, className, ...icon_props } = props

	const target_class = $cx(icon_props?.weight === 'duotone' && styles._local, className)
	const target_props = { ...omit(icon_props, 'ref'), className: target_class }
	const Icon = useMemo(() => icon_map[type], [type])

	return <Icon {...target_props} />
}

export default $app.memo(Index)
