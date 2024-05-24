import { useMemoizedFn } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'
import { debounce } from 'lodash-es'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useStackSelector } from '@/context/stack'

import styles from './index.css'

import type { ReactNode } from 'react'
interface IProps {
	open: boolean
	position: { x: number; y: number }
	children: ReactNode
	top?: boolean
	updatePosition: () => void
}

const Index = (props: IProps) => {
	const { open, position, children, top, updatePosition } = props
	const [exist, setExsit] = useState(false)
	const [oveflow, setOverflow] = useState(0)
	const id = useStackSelector(v => v.id)
	const ref = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (open) return setExsit(true)

		const timer = setTimeout(() => {
			setExsit(false)
			setOverflow(0)
		}, 180)

		return () => clearTimeout(timer)
	}, [open])

	const checkOverflow = useMemoizedFn(() => {
		if (!ref.current) return

		const { right: right_container } = document.getElementById(id).getBoundingClientRect()
		const { right: right_ref } = ref.current.getBoundingClientRect()

		setOverflow(right_ref > right_container ? right_ref - right_container : 0)
	})

	const onResize = useMemoizedFn(
		debounce(() => {
			updatePosition()
			checkOverflow()
		}, 450)
	)

	useEffect(() => {
		if (!exist) return setOverflow(0)

		checkOverflow()

		const container = document.getElementById(id)

		container.addEventListener('scroll', updatePosition)

		const resize_observer = new ResizeObserver(onResize)

		resize_observer.observe(container)

		return () => {
			setOverflow(0)

			container.removeEventListener('scroll', updatePosition)

			resize_observer.unobserve(container)
			resize_observer.disconnect()
		}
	}, [exist])

	if (!exist) return null

	const Content = (
		<AnimatePresence>
			{open && (
				<motion.div
					className={$cx(
						'fixed z_index_100',
						styles._local,
						top && styles.top,
						oveflow && styles.oveflow
					)}
					style={{ top: position.y, left: position.x - oveflow }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
					ref={ref}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)

	return createPortal(Content, document.getElementById(id))
}

export default $app.memo(Index)
