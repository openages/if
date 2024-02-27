import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { debounce } from 'lodash-es'

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
	const { setFieldsValue, getFieldsValue } = form

	useDeepEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		setFieldsValue(item)
	}, [item])

	const onDebounceChange = onTableRowChange && useMemoizedFn(debounce(onTableRowChange, 450))

	const onValuesChange: FormProps<Todo.Todo>['onValuesChange'] = useMemoizedFn(changedValues => {
		const key = Object.keys(changedValues)[0] as keyof Partial<Todo.Todo>

		if (key === 'text') {
			return onDebounceChange(index, changedValues)
		}

		onTableRowChange(index, changedValues)
	})

	return (
		<tr {...rest}>
			<Form form={form} component={false} onValuesChange={onValuesChange}>
				{children}
			</Form>
		</tr>
	)
}

export default $app.memo(Index)
