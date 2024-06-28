import { match } from 'ts-pattern'

import { module_default_icon } from '@/appdata'
import { Emoji } from '@/components'
import { Folders, ListBullets } from '@phosphor-icons/react'

import type { IPropsLeftIcon } from '../DirTree/types'
import type { CSSProperties } from 'react'

const Index = (props: IPropsLeftIcon) => {
	const { module, item, size = 16, className } = props

	return match({ ...item, module })
		.with({ type: 'file', module: 'todo' }, () => <ListBullets className={className} size={size} />)
		.with({ type: 'file' }, () => (
			<Emoji className={className} shortcodes={module_default_icon[module]} size={size} />
		))
		.with({ type: 'dir' }, () => <Folders className={className} size={size} />)
		.otherwise(({ icon }) => <span className={className}>{icon}</span>)
}

export default $app.memo(Index)
