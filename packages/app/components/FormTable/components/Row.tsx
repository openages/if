import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { pick } from 'lodash-es'

import { useDeepEffect } from '@/hooks'
import { deepEqual, useDeepMemo } from '@openages/stk/react'

import Column from './Column'

import type { IPropsRow } from '../types'
import type { FormProps } from 'antd'

const { useForm } = Form

const Index = (props: IPropsRow) => {
	const { columns, item, index, left_shadow_index, right_shadow_index, sort, onChange, getRowClassName } = props
	const [form] = useForm()
	const { setFieldsValue, getFieldsValue } = form

	useDeepEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		setFieldsValue(item)
	}, [item])

	const onValuesChange: FormProps['onValuesChange'] = useMemoizedFn(v => {
		onChange(index, v)
	})

	const className = useDeepMemo(() => getRowClassName(item), [item])

	return (
		<tr className={$cx('form_table_tr', ...className)}>
			<Form form={form} component={false} onValuesChange={onValuesChange}>
				{columns.map((col, idx) => (
					<Column
						row_index={index}
						dataIndex={col.dataIndex}
						deps={pick(item, col.deps)}
						component={col.component}
						align={col.align}
						fixed={col.fixed}
						extra={col.extra}
						stickyOffset={col.stickyOffset}
						shadow={
							(left_shadow_index === idx && 'start') ||
							(right_shadow_index === idx && 'end')
						}
						sorting={sort?.field === col.dataIndex && sort?.order !== null}
						getProps={col.getProps}
						onAction={col.onAction}
						key={col.dataIndex || col.title}
					></Column>
				))}
			</Form>
		</tr>
	)
}

export default $app.memo(Index)
