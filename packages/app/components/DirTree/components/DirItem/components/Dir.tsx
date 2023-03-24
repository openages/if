import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useDeepMemo } from '@matrixages/knife/react'

import DirItem from '../index'
import Item from './Item'

import type { IPropsDirItem, IPropsDirItem_Item } from '../../../types'

const Index = (props: IPropsDirItem) => {
	const { module, item, current_item, fold_all, depth = 1, setFoldAll, showDirTreeOptions } = props
	const { id, type } = item
	const [open, setOpen] = useState(false)
	const { setNodeRef } = useDroppable({ id })

	const children = useDeepMemo(() => {
		if (item.type === 'dir') return item.children
	}, [item])

	useEffect(() => {
		if (fold_all) setOpen(false)
	}, [fold_all])

	useUpdateEffect(() => setOpen(true), [children])

	const onItem = useMemoizedFn(() => {
		setOpen(!open)

		if (!open) setFoldAll(false)
	})

	const props_item: IPropsDirItem_Item = {
		module,
		item,
		current_item,
		depth,
		showDirTreeOptions,
		onItem
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
						ref={setNodeRef}
					>
						<SortableContext items={item.children}>
							{item.children.map((it) => (
								<DirItem {...props} item={it} depth={depth + 1} key={it.id}></DirItem>
							))}
						</SortableContext>
					</motion.div>
				)}
			</AnimatePresence>
		</Fragment>
	)
}

export default $app.memo(Index)
