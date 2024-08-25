import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'
import { Menu } from 'react-contexify'
import { useTranslation } from 'react-i18next'

import { ContextMenuItem } from '@/components'
import { CirclesThreePlus, ListPlus, Pencil, Trash } from '@phosphor-icons/react'

import type { IPropsOptions } from '../../types'

const Index = (props: IPropsOptions) => {
	const { focusing_item, onOptions, resetFocusingItem } = props
	const { t } = useTranslation()
	const [click_option, setClickOption] = useState(false)

	const onAddFile = useMemoizedFn(() => {
		setClickOption(true)
		onOptions('add_file')
	})

	const onAddDir = useMemoizedFn(() => {
		setClickOption(true)
		onOptions('add_dir')
	})

	const onRename = useMemoizedFn(() => {
		setClickOption(true)
		onOptions('rename')
	})

	const onDeleteTrigger = useMemoizedFn(() => onOptions('delete'))
	const onDeletePressTrigger = useMemoizedFn(() => setClickOption(true))

	const onVisibilityChange = useMemoizedFn((v: boolean) => {
		if (!v && !click_option) {
			resetFocusingItem()
		} else {
			setClickOption(false)
		}
	})

	return (
		<Menu id='dirtree_options' animation='scale' onVisibilityChange={onVisibilityChange}>
			<ContextMenuItem
				itemProps={{ onClick: onRename }}
				Icon={Pencil}
				text={t('dirtree.options.rename')}
			></ContextMenuItem>
			<If condition={focusing_item.type === 'dir'}>
				<ContextMenuItem
					itemProps={{ onClick: onAddFile }}
					Icon={ListPlus}
					text={t('dirtree.add') + t('dirtree.file')}
				></ContextMenuItem>
				<ContextMenuItem
					itemProps={{ onClick: onAddDir }}
					Icon={CirclesThreePlus}
					text={t('dirtree.add') + t('dirtree.dir')}
				></ContextMenuItem>
			</If>
			<ContextMenuItem
				itemProps={{ closeOnClick: false }}
				className='red'
				Icon={Trash}
				text={t('dirtree.options.delete')}
				danger={focusing_item.type === 'dir' ? 3 : 1.5}
				trigger={onDeleteTrigger}
				pressTrigger={onDeletePressTrigger}
			></ContextMenuItem>
		</Menu>
	)
}

export default $app.memo(Index)
