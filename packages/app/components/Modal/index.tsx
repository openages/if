import { useClickAway } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'

import { X } from '@phosphor-icons/react'

import styles from './index.css'

import type { MouseEvent, ReactNode } from 'react'

interface IProps {
	children: ReactNode
	open: boolean
	className?: HTMLDivElement['className']
	title?: string | number
	width?: string | number
	minHeight?: string | number
	maskClosable?: boolean
	disableOverflow?: boolean
	hideClose?: boolean
	onCancel?: (e: MouseEvent<HTMLDivElement>) => void
	getContainer?: () => Element
}

const Index = (props: IProps) => {
	const {
		children,
		open,
		className,
		title,
		width,
		minHeight,
		maskClosable,
		disableOverflow,
		hideClose,
		onCancel,
		getContainer
	} = props
	const ref_content_wrap = useRef<HTMLDivElement>(null)
	const ref_content = useRef<HTMLDivElement>(null)
	const [on_body, setOnbody] = useState(false)
	const [exsit, setExsit] = useState(false)
	const container = getContainer?.()

	useEffect(() => {
		if (open) {
			setExsit(true)
		} else {
			const timer = setTimeout(() => {
				setExsit(false)
			}, 180)

			return () => clearTimeout(timer)
		}
	}, [open])

	useClickAway(e => {
		if (!maskClosable) return
		if (e.target !== ref_content_wrap.current) return

		onCancel?.(e as unknown as MouseEvent<HTMLDivElement>)
	}, ref_content)

	useEffect(() => {
		setOnbody(container === document.body)
	}, [container])

	if (!exsit) return null

	const Content = (
		<Fragment>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.18, ease: 'easeInOut' }}
						className={$cx(styles.mask, on_body && styles.on_body, 'w_100 h_100')}
					></motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ transform: 'translate3d(0px, -30px, 0px)', opacity: 0 }}
						animate={{ transform: 'translate3d(0px, 0px, 0px)', opacity: 1 }}
						exit={{ transform: 'translate3d(0px, 30px, 0px)', opacity: 0 }}
						transition={{ duration: 0.18, ease: 'easeInOut' }}
						className={$cx(
							styles.content_wrap,
							on_body && styles.on_body,
							disableOverflow && styles.disableOverflow,
							'if_modal_wrap w_100 h_100 border_box flex align_center'
						)}
						ref={ref_content_wrap}
					>
						<div
							className={$cx(
								styles.content,
								className,
								'if_modal_content border_box flex flex_column'
							)}
							style={{ width: width ?? 360, minHeight }}
							ref={ref_content}
						>
							{title && (
								<div
									className={$cx(
										styles.header,
										'w_100 border_box flex justify_between align_center'
									)}
								>
									<span className='title'>{title}</span>
									{!hideClose && (
										<span
											className='btn_close flex justify_center align_center clickable'
											onClick={onCancel}
										>
											<X size={14}></X>
										</span>
									)}
								</div>
							)}
							<div
								className={$cx(
									styles.body,
									className,
									disableOverflow && styles.disableOverflow,
									'if_modal_body border_box flex flex_column'
								)}
							>
								{children}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</Fragment>
	)

	if (container) {
		return createPortal(Content, container)
	}

	return Content
}

export default $app.memo(Index)
