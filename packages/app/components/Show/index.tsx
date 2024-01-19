import { motion, AnimatePresence } from 'framer-motion'

import type { ReactNode } from 'react'

interface IProps {
	children: ReactNode
	visible: boolean
	className?: HTMLDivElement['className']
}

const Index = (props: IProps) => {
	const { children, visible, className } = props

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className={$cx(className)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18, ease: 'easeInOut' }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default $app.memo(Index)
