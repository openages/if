import { motion, AnimatePresence } from 'framer-motion'
import { useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { useStackSelector } from '@/context/stack'

import styles from './index.css'

import type { ReactNode } from 'react'

interface IProps {
	open: boolean
	position: { x: number; y: number }
	children: ReactNode
	top?: boolean
}

const Index = (props: IProps) => {
	const { open, position, children, top } = props
	const [exist, setExsit] = useState(false)
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		if (open) return setExsit(true)

		const timer = setTimeout(() => {
			setExsit(false)
		}, 180)

		return () => clearTimeout(timer)
	}, [open])

	if (!exist) return null

	const Content = (
		<AnimatePresence>
			{open && (
				<motion.div
					className={$cx('fixed z_index_100', styles._local, top && styles.top)}
					style={{ top: position.y, left: position.x }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)

	return createPortal(Content, document.getElementById(id))
}

export default $app.memo(Index)
