import { match } from 'ts-pattern'

import { module_default_icon } from '@/appdata'
import { Emoji } from '@/components'
import { Folders, ListBullets } from '@phosphor-icons/react'

import type { IPropsLeftIcon } from '../DirTree/types'
import type { CSSProperties } from 'react'

const Index = (props: IPropsLeftIcon) => {
	const { module, item, size = 16 } = props

	const common_style: CSSProperties = { marginBottom: -1 }

	return match({ ...item, module })
		.with({ type: 'file', module: 'todo' }, () => <ListBullets size={size} style={common_style} />)
		.with({ type: 'file' }, () => <Emoji shortcodes={module_default_icon[module]} size={size} />)
		.with({ type: 'dir' }, () => <Folders size={size} style={common_style} />)
		.otherwise(({ icon }) => <span>{icon}</span>)
}

export default $app.memo(Index)
