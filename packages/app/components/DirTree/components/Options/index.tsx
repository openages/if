import { useMemoizedFn } from 'ahooks'
import { Item, Menu, Submenu } from 'react-contexify'
import { When } from 'react-if'

import { ContextMenuItem } from '@/components'
import { useLocale } from '@/hooks'
import { ArrowSquareRight, ListPlus, Pencil, Trash } from '@phosphor-icons/react'

import type { IPropsOptions } from '../../types'
const Index = (props: IPropsOptions) => {
	const { focusing_item, onOptions } = props
	const l = useLocale()

	const onDelete = useMemoizedFn(() => onOptions('delete'))

	return (
		<Menu id='dirtree_options' animation='scale'>
			<Item>
				<ContextMenuItem Icon={Pencil} text={l('dirtree.options.rename')}></ContextMenuItem>
			</Item>
			<When condition={focusing_item.type === 'dir'}>
				<Item>
					<ContextMenuItem
						Icon={ListPlus}
						text={l('dirtree.add') + l('dirtree.file')}
					></ContextMenuItem>
				</Item>
				<Submenu
					label={
						<ContextMenuItem
							Icon={ArrowSquareRight}
							text={l('dirtree.options.moveto')}
						></ContextMenuItem>
					}
				>
					<Item>today</Item>
					<Item>plan</Item>
					<Item>ghost plan</Item>
				</Submenu>
			</When>
			<Item closeOnClick={false}>
				<ContextMenuItem
					className='red'
					Icon={Trash}
					text={l('dirtree.options.delete')}
					danger={focusing_item.type === 'dir' ? 3 : 1.5}
					trigger={onDelete}
				></ContextMenuItem>
			</Item>
		</Menu>
	)
}

export default $app.memo(Index)
