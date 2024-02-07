import { useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useDeepUpdateEffect } from '@openages/stk/react'

import DirItem from '../index'
import Item from './Item'

import type { IPropsDirItem_Dir, IPropsDirItem_Item } from '../../../types'
import type { Extend } from '@/types'

const Index = (props: IPropsDirItem_Dir) => {
	const {
		module,
		item,
		current_item,
		focusing_item,
		open_folder,
		parent_index = [],
		dragging,
		showDirTreeOptions
	} = props
	const { type, children = [] } = item as Extend.DirTree.TransformedItem
	const [open, setOpen] = useState(false)
	const { attributes, listeners, transform, isDragging, setNodeRef } = useDraggable({
		id: item.id,
		data: { item, parent_index }
	})

	useDeepCompareEffect(() => {
		setOpen(open_folder.includes(item.id))
	}, [open_folder, item.id])

	useDeepUpdateEffect(() => {
		setOpen(true)

		if (children?.length) {
			$app.Event.emit(`${module}/dirtree/addOpenFolder`, item.id)
		} else {
			$app.Event.emit(`${module}/dirtree/removeOpenFolder`, item.id)
		}
	}, [module, children, item.id])

	useEffect(() => {
		if (isDragging) {
			setOpen(false)

			$app.Event.emit(`${module}/dirtree/removeOpenFolder`, item.id)
		}
	}, [module, isDragging, item.id])

	const props_item: IPropsDirItem_Item = {
		module,
		item,
		current_item,
		focusing_item,
		parent_index,
		dragging,
		open,
		showDirTreeOptions,
		onClick: useMemoizedFn(() => {
			setOpen(!open)

			if (children?.length) {
				if (!open) {
					$app.Event.emit(`${module}/dirtree/addOpenFolder`, item.id)
				} else {
					$app.Event.emit(`${module}/dirtree/removeOpenFolder`, item.id)
				}
			}
		})
	}

	return (
		<div
			className='dir_wrap w_100 flex flex_column'
			style={{ transform: CSS.Translate.toString(transform) }}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
		>
			<Item {...props_item}></Item>
			<AnimatePresence>
				{type === 'dir' && open && (
					<motion.div
						className='children_wrap w_100 border_box flex flex_column overflow_hidden'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
						layout
					>
						{children.map((it, index) => (
							<DirItem
								{...props}
								item={it}
								parent_index={[...parent_index, index]}
								key={it.id}
							></DirItem>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default $app.memo(Index)
