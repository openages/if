import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Else, If, Then, When } from 'react-if'

import { useDeepMemo } from '@matrixages/knife/react'
import { CaretRight } from '@phosphor-icons/react'

import LeftIcon from '../LeftIcon'
import styles from './index.css'

import type { IPropsDirItem } from '../../types'

const Index = (props: IPropsDirItem & { depth?: number }) => {
	const { module, item, current_item, fold_all, depth = 1, onClick, setFoldAll, showDirTreeOptions } = props
	const { id, name, type } = item
	const [open, setOpen] = useState(false)

	const children = useDeepMemo(() => {
		if (item.type === 'dir') return item.children
	}, [item])

	useEffect(() => {
		if (fold_all) setOpen(false)
	}, [fold_all])

	useUpdateEffect(() => setOpen(true), [children])

	const onItem = useMemoizedFn(() => {
		if (type === 'dir') {
			setOpen(!open)

			if (!open) setFoldAll(false)
		}

		onClick(id)
	})

	return (
		<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
			<div
				className={$cx(
					'item_wrap w_100 border_box flex align_center relative transition_normal cursor_point',
					type === 'file' && current_item === id && 'active'
				)}
				onClick={onItem}
				onContextMenu={(e) => showDirTreeOptions(e, item)}
				style={{ paddingLeft: 18 * depth }}
			>
				<div className='left_icon_wrap flex justify_center align_center'>
					<If condition={item.icon}>
						<Then>
							<em-emoji shortcodes={item.icon} size='18px'></em-emoji>
						</Then>
						<Else>
							<LeftIcon module={module} item={item}></LeftIcon>
						</Else>
					</If>
				</div>
				<span className={$cx('title_wrap')}>{name}</span>
				<span
					className={$cx(
						'right_icon_wrap flex align_center justify_end',
						type === 'dir' && item.children.length === 0 && 'no_children'
					)}
				>
					<When condition={type === 'dir'}>
						<CaretRight
							className={$cx('icon_fold transition_normal', open && 'opened')}
							size={14}
							weight='bold'
						/>
					</When>
				</span>
			</div>
			<AnimatePresence>
				{type === 'dir' && open && (
					<motion.div
						className='children_wrap w_100 border_box flex flex_column overflow_hidden'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						{item.children?.map((it) => (
							<Index
								{...{
									module,
									current_item,
									fold_all,
									onClick,
									setFoldAll,
									showDirTreeOptions
								}}
								item={it}
								depth={depth + 1}
								key={it.id}
							></Index>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default $app.memo(Index)
