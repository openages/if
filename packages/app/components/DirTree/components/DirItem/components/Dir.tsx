import { useMemoizedFn, useUpdateEffect, useDeepCompareEffect } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'

import { useDeepMemo } from '@/hooks'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import DirItem from '../index'
import Item from './Item'

import type { IPropsDirItem_Dir, IPropsDirItem_Item } from '../../../types'

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
	const { type } = item
	const [open, setOpen] = useState(false)
	const { attributes, listeners, transform, isDragging, setNodeRef } = useDraggable({
		id: item.id,
		data: { item, parent_index }
	})

	useDeepCompareEffect(() => {
		setOpen(open_folder.includes(item.id))
	}, [open_folder, item.id])

	const children = useDeepMemo(() => {
		if (item.type === 'dir') return item.children
	}, [item])

	useUpdateEffect(() => {
		setOpen(true)

		if (children?.length) {
			$app.Event.emit(`${module}/dirtree/addOpenFolder`, item.id)
		} else {
			$app.Event.emit(`${module}/dirtree/removeOpenFolder`, item.id)
		}
	}, [children, module, item.id])

	useEffect(() => {
		if (isDragging) {
			$app.Event.emit(`${module}/dirtree/removeOpenFolder`, item.id)
		}
	}, [isDragging, module, item.id])

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
			if (children?.length) {
				if (!open) {
					$app.Event.emit(`${module}/dirtree/addOpenFolder`, item.id)
				} else {
					$app.Event.emit(`${module}/dirtree/removeOpenFolder`, item.id)
				}
			}

			setOpen(!open)
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
					>
						{item.children.map((it, index) => (
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
