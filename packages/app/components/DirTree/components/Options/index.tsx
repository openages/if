import { useMemoizedFn } from 'ahooks'
import { Menu, Submenu } from 'react-contexify'
import { When } from 'react-if'

import { ContextMenuItem } from '@/components'
import { useLocale } from '@/hooks'
import { ArrowSquareRight, CirclesThreePlus, ListPlus, Pencil, Trash } from '@phosphor-icons/react'

import type { IPropsOptions } from '../../types'

const Index = (props: IPropsOptions) => {
	const { focusing_item, onOptions } = props
	const l = useLocale()

	const onAddFile = useMemoizedFn(() => onOptions('add_file'))
	const onAddDir = useMemoizedFn(() => onOptions('add_dir'))
	const onDelete = useMemoizedFn(() => onOptions('delete'))
	const onRename = useMemoizedFn(() => onOptions('rename'))

	return (
		<Menu id='dirtree_options' animation='scale'>
			<ContextMenuItem
				itemProps={{ onClick: onRename }}
				Icon={Pencil}
				text={l('dirtree.options.rename')}
			></ContextMenuItem>
			<When condition={focusing_item.type === 'dir'}>
				<ContextMenuItem
					itemProps={{ onClick: onAddFile }}
					Icon={ListPlus}
					text={l('dirtree.add') + l('dirtree.file')}
				></ContextMenuItem>
				<ContextMenuItem
					itemProps={{ onClick: onAddDir }}
					Icon={CirclesThreePlus}
					text={l('dirtree.add') + l('dirtree.dir')}
				></ContextMenuItem>
			</When>
			<ContextMenuItem
				itemProps={{ closeOnClick: false }}
				className='red'
				Icon={Trash}
				text={l('dirtree.options.delete')}
				danger={focusing_item.type === 'dir' ? 3 : 1.5}
				trigger={onDelete}
			></ContextMenuItem>
		</Menu>
	)
}

export default $app.memo(Index)
