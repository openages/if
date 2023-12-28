import { Form } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import { useDeepEffect } from '@/hooks'

import type { ReactNode, DOMAttributes } from 'react'
import type { Todo } from '@/types'

const { useForm } = Form

interface IProps {
	item: Todo.Todo
	children: ReactNode
	onClick: DOMAttributes<HTMLTableCellElement>['onClick']
}

const Index = (props: IProps) => {
	const { item, onClick, ...rest } = props
	const [form] = useForm()
	const [loaded, setLoaded] = useState(false)
	const { setFieldsValue } = form

	useDeepEffect(() => {
		setFieldsValue(item)

		setLoaded(true)
	}, [item])

	return (
		<Form form={form} component={false}>
			<AnimatePresence>
				{loaded && (
					<motion.tr
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.9 }}
						{...rest}
					/>
				)}
			</AnimatePresence>
		</Form>
	)
}

export default $app.memo(Index)
