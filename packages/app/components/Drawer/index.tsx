import { useClickAway } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'

import { X } from '@phosphor-icons/react'

import styles from './index.css'

import type { MouseEvent, ReactNode } from 'react'

interface IProps {
	children: ReactNode
	open: boolean
	placement?: 'left' | 'right' | 'top' | 'bottom'
	className?: HTMLDivElement['className']
	bodyClassName?: HTMLDivElement['className']
	title?: string | number
	width?: string | number
	maskClosable?: boolean
	disableOverflow?: boolean
	disablePadding?: boolean
	hideClose?: boolean
	zIndex?: number
	onCancel?: (e: MouseEvent<HTMLDivElement>) => void
	getContainer?: () => Element
	getRef?: (v: HTMLElement | null) => void
}

const Index = (props: IProps) => {
	const {
		children,
		open,
		placement = 'left',
		className,
		bodyClassName,
		title,
		width,
		maskClosable,
		disableOverflow,
		disablePadding,
		hideClose,
		zIndex,
		onCancel,
		getContainer,
		getRef
	} = props
	const ref_content_wrap = useRef<HTMLDivElement>(null)
	const ref_content = useRef<HTMLDivElement>(null)
	const [on_body, setOnbody] = useState(false)
	const [exsit, setExsit] = useState(false)
	const container = getContainer?.() || document.body

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

	const transform = useMemo(() => {
		switch (placement) {
			case 'left':
				return 'translate3d(-100%, 0px, 0px)'
			case 'right':
				return 'translate3d(100%, 0px, 0px)'
			case 'top':
				return 'translate3d(0px, -100%, 0px)'
			case 'bottom':
				return 'translate3d(0px, 100%, 0px)'
		}
	}, [placement])

	if (!exsit) return null

	const Content = (
		<Fragment>
			<AnimatePresence>
				{open && (
					<motion.div
						className={$cx(styles.mask, on_body && styles.on_body, 'w_100 h_100')}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.18, ease: 'easeInOut' }}
						style={{ zIndex: zIndex ?? 1001 }}
					></motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{open && (
					<div
						className={$cx(
							styles.content_wrap,
							on_body && styles.on_body,
							disableOverflow && styles.disableOverflow,
							disablePadding && styles.disablePadding,
							'if_modal_wrap w_100 h_100 border_box flex align_end'
						)}
						ref={ref_content_wrap}
						style={{ zIndex: zIndex ? zIndex + 1 : 1002 }}
					>
						<motion.div
							className={$cx(
								styles.content,
								className,
								'if_modal_content border_box flex flex_column'
							)}
							initial={{ transform }}
							animate={{ transform: 'translate3d(0px, 0px, 0px)' }}
							exit={{ transform }}
							transition={{ duration: 0.18, ease: 'easeInOut' }}
							style={{ width: width ?? 300 }}
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
									bodyClassName,
									disableOverflow && styles.disableOverflow,
									'if_modal_body w_100 border_box flex flex_column'
								)}
								ref={getRef}
							>
								{children}
							</div>
						</motion.div>
					</div>
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
