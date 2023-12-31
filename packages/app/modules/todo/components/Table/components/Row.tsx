import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { debounce } from 'lodash-es'
import { useState } from 'react'

import { useDeepEffect } from '@/hooks'
import { deepEqual } from '@openages/stk/react'

import type { ReactElement, DOMAttributes } from 'react'
import type { Todo } from '@/types'
import type { FormProps } from 'antd'
import type { IPropsTable } from '../../../types'

const { useForm } = Form

interface IProps {
	item: Todo.Todo
	index: number
	children: ReactElement
	onClick: DOMAttributes<HTMLTableCellElement>['onClick']
	onTableRowChange: IPropsTable['onTableRowChange']
}

const Index = (props: IProps) => {
	const { item, index, children, onClick, onTableRowChange, ...rest } = props
	const [form] = useForm<Todo.Todo>()
	const [loaded, setLoaded] = useState(false)
	const { setFieldsValue, getFieldsValue } = form

	useDeepEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		setFieldsValue(item)
		setLoaded(true)
	}, [item])

	const onDebounceChange = useMemoizedFn(debounce(onTableRowChange, 450))

	const onValuesChange: FormProps<Todo.Todo>['onValuesChange'] = useMemoizedFn(changedValues => {
		const key = Object.keys(changedValues)[0] as keyof Partial<Todo.Todo>

		if (key === 'text') {
			return onDebounceChange(index, changedValues)
		}

		onTableRowChange(index, changedValues)
	})

	return (
		<Form form={form} component={false} onValuesChange={onValuesChange}>
			<AnimatePresence>
				{loaded && (
					<motion.tr
						{...rest}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.9 }}
					>
						{children}
					</motion.tr>
				)}
			</AnimatePresence>
		</Form>
	)
}

export default $app.memo(Index)
