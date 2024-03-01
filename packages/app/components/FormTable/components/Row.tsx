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
	const {
		columns,
		item,
		index,
		left_shadow_index,
		right_shadow_index,
		sort,
		editing_field,
		setEditingInfo,
		onChange,
		getRowClassName
	} = props
	const [form] = useForm()
	const { setFieldsValue, getFieldsValue } = form

	const setEditingField = useMemoizedFn((v: string) => {
		setEditingInfo(v ? { row_index: index, field: v } : null)
	})

	useDeepEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		setFieldsValue(item)
	}, [item])

	const onValuesChange: FormProps['onValuesChange'] = useMemoizedFn(v => {
		const key = Object.keys(v)[0]
		const column = columns.find(item => item.dataIndex === key)

		onChange(index, v)

		if (!column.disableResetEditing) setEditingField('')
	})

	const className = useDeepMemo(() => getRowClassName(item), [item])

	return (
		<Form form={form} component={false} onValuesChange={onValuesChange}>
			<tr className={$cx('form_table_tr', ...className)}>
				{columns.map((col, idx) => (
					<Column
						value={pick(item, col.dataIndex)[col.dataIndex]}
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
						editing={
							col.alwaysEditing
								? true
								: !col.disableEditing && col.dataIndex === editing_field
						}
						setEditingField={!col.alwaysEditing && !col.disableEditing && setEditingField}
						getProps={col.getProps}
						onAction={col.onAction}
						key={col.dataIndex || col.title}
					></Column>
				))}
			</tr>
		</Form>
	)
}

export default $app.memo(Index)
