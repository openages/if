import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { pick } from 'lodash-es'
import { useEffect } from 'react'
import { match } from 'ts-pattern'

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
		editing_info,
		setEditingInfo,
		onChange,
		getRowClassName
	} = props
	const [form] = useForm()
	const { setFieldsValue, getFieldsValue } = form

	const setEditingField = useMemoizedFn((args: { field: string; focus: boolean } | null) => {
		setEditingInfo(args ? { row_index: index, field: args.field, focus: args.focus } : null)
	})

	useEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		setFieldsValue(item)
	}, [item])

	const onRowChange = useMemoizedFn(v => onChange(index, v))

	const onValuesChange: FormProps['onValuesChange'] = useMemoizedFn(v => {
		const key = Object.keys(v)[0]
		const column = columns.find(item => item.dataIndex === key)!

		onChange(index, v)

		if (column.resetEditing) setEditingField(null)
	})

	const className = useDeepMemo(() => getRowClassName?.(item), [item])

	return (
		<Form form={form} component={false} onValuesChange={onValuesChange}>
			<tr className={$cx('form_table_tr', ...(className || []))}>
				{columns.map((col, idx) => {
					const focus = match(col.alwaysEditing)
						.with(true, () => true)
						.otherwise(() => {
							return (
								!col.disableEditing &&
								editing_info &&
								col.dataIndex === editing_info.field
							)
						})

					return (
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
							alwaysEditing={col.alwaysEditing}
							disableEditing={col.disableEditing}
							focus={focus!}
							useRowChange={col.useRowChange}
							setEditingField={!col.disableEditing ? setEditingField : undefined}
							getProps={col.getProps}
							onAction={col.onAction}
							onRowChange={col.useRowChange ? onRowChange : undefined}
							key={col.dataIndex || col.title}
						></Column>
					)
				})}
			</tr>
		</Form>
	)
}

export default $app.memo(Index)
