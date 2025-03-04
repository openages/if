import { motion, AnimatePresence } from 'framer-motion'

import type { ReactNode } from 'react'

interface IProps {
	children: ReactNode
	visible: boolean
	initial?: boolean
	className?: HTMLDivElement['className']
	height?: boolean
}

const Index = (props: IProps) => {
	const { children, visible, initial, className, height } = props

	return (
		<AnimatePresence initial={initial}>
			{visible && (
				<motion.div
					className={$cx(className)}
					initial={{ opacity: 0, ...(height ? { height: 0 } : {}) }}
					animate={{ opacity: 1, ...(height ? { height: 'auto' } : {}) }}
					exit={{ opacity: 0, ...(height ? { height: 0 } : {}) }}
					transition={{ duration: 0.18, ease: 'easeInOut' }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default $app.memo(Index)
