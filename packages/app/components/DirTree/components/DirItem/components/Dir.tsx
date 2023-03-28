import { useUpdateEffect } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect } from 'react'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDeepMemo } from '@matrixages/knife/react'

import DirItem from '../index'
import Item from './Item'

import type { IPropsDirItem_Dir, IPropsDirItem_Item } from '../../../types'

const Index = (props: IPropsDirItem_Dir) => {
	const {
		module,
		item,
		current_item,
		fold_all,
		parent_index = [],
		open,
		setOpen,
		onClick,
		showDirTreeOptions
	} = props
	const { type } = item

	const children = useDeepMemo(() => {
		if (item.type === 'dir') return item.children
	}, [item])

	useEffect(() => {
		if (fold_all) setOpen(false)
	}, [fold_all])

	useUpdateEffect(() => setOpen(true), [children])

	const props_item: IPropsDirItem_Item = {
		module,
		item,
		current_item,
		parent_index,
		open,
		showDirTreeOptions,
		onItem: onClick
	}

	return (
		<Fragment>
			<Item {...props_item}></Item>
			<AnimatePresence>
				{type === 'dir' && open && (
					<motion.div
						className='children_wrap w_100 border_box flex flex_column overflow_hidden'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						<SortableContext items={item.children} strategy={verticalListSortingStrategy}>
							{item.children.map((it, index) => (
								<DirItem
									{...props}
									item={it}
									parent_index={[...parent_index, index]}
									key={it.id}
								></DirItem>
							))}
						</SortableContext>
					</motion.div>
				)}
			</AnimatePresence>
		</Fragment>
	)
}

export default $app.memo(Index)
