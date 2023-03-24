import { useMemoizedFn } from 'ahooks'
import { Submenu } from 'react-contexify'

import { ContextMenuItem } from '@/components'
import { DiceFour } from '@phosphor-icons/react'

import type { IPropsDirs } from '../../types'

const Index = (props: IPropsDirs) => {
	const { item, moveTo } = props

	const move = useMemoizedFn(() => moveTo(item.id))

	if (item.children.length) {
		return (
			<Submenu
				label={
					<ContextMenuItem
						itemProps={{ onClick: move }}
						Icon={DiceFour}
						text={item.name}
					></ContextMenuItem>
				}
			>
				{item.children.map((it) => (
					<ContextMenuItem
						itemProps={{ onClick: () => moveTo(it.id) }}
						Icon={DiceFour}
						text={it.name}
						key={it.id}
					></ContextMenuItem>
				))}
			</Submenu>
		)
	}

	return (
		<ContextMenuItem
			itemProps={{ onClick: move }}
			Icon={DiceFour}
			text={item.name}
		></ContextMenuItem>
	)
}

export default $app.memo(Index)
