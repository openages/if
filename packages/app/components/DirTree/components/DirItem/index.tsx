import { useMemoizedFn } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { match, P } from 'ts-pattern'

import { deepEqual, useDeepMemo } from '@matrixages/knife/react'
import { CaretRight, DiceFour, ListBullets } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsDirItem } from '../../types'

const Index = (props: IPropsDirItem) => {
	const { _id, name, type, current_item, fold_all, onClick, setFoldAll } = props
	const [open, setOpen] = useState(false)

	const onItem = useMemoizedFn(() => {
		if (type === 'dir') return setOpen(!open)

		onClick(_id)
	})

	const LeftIcon = useDeepMemo(() => {
		return match(props)
			.with({ type: 'dir' }, () => <DiceFour size={16} />)
			.with({ type: 'file', icon: P.optional(P.nullish) }, () => <ListBullets size={16} />)
			.otherwise(({ icon }) => icon)
	}, [props])

	const RightIcon = useDeepMemo(() => {
		return (
			match({ ...props, open })
				.with({ type: 'dir', open: P.select() }, (open) => (
					<CaretRight
						className={$cx('icon_fold transition_normal', open && 'opened')}
						size={14}
						weight='bold'
					/>
				))
				// .with({ type: 'file' }, ({ counts }) => counts)
				.otherwise(() => '')
		)
	}, [props, open])

	return (
		<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
			<div
				className={$cx(
					'item_wrap w_100 border_box flex align_center relative transition_normal cursor_point',
					type === 'file' && current_item === _id && 'active'
				)}
				onClick={onItem}
			>
				<div className='left_icon_wrap flex justify_center align_center'>{LeftIcon}</div>
				<span className={$cx('title_wrap')}>{name}</span>
				<span className='right_icon_wrap flex align_center justify_end'>{RightIcon}</span>
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
						{props.children?.map((it) => (
							<Index
								{...it}
								{...{ current_item, fold_all, onClick, setFoldAll }}
								key={it._id}
							></Index>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default $app.memo(Index)
