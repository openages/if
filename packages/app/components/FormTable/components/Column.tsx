import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { cloneElement } from 'react'

import { useStyle } from '../hooks'

import type { IPropsColumn, Component } from '../types'
import type { ReactElement } from 'react'

const { Item } = Form

const Field = $app.memo((props: Pick<IPropsColumn, 'component'> & Component<any>) => {
	const {
		component,
		value,
		row_index,
		dataIndex,
		deps,
		extra,
		editing,
		setEditingField,
		getProps,
		onAction,
		onChange
	} = props

	const change = useMemoizedFn(onChange ? onChange : () => {})

	return cloneElement(component as ReactElement, {
		value,
		row_index,
		dataIndex,
		deps,
		extra,
		editing,
		setEditingField,
		getProps,
		onAction,
		onChange: change
	})
})

const Index = (props: IPropsColumn) => {
	const {
		value,
		row_index,
		dataIndex,
		deps,
		component,
		align,
		fixed,
		extra,
		stickyOffset,
		shadow,
		sorting,
		editing,
		setEditingField,
		getProps,
		onAction
	} = props
	const style = useStyle({ align, fixed, stickyOffset })

	const props_field = {
		component,
		row_index,
		dataIndex,
		deps,
		extra,
		editing,
		setEditingField,
		getProps,
		onAction
	}

	if (!editing) props_field['value'] = value

	const Content = <Field {...props_field}></Field>

	return (
		<td
			className={$cx(
				'form_table_td',
				shadow && 'shadow',
				shadow && (shadow === 'start' ? 'shadow_start' : 'shadow_end'),
				sorting && 'sorting'
			)}
			style={style}
		>
			{editing ? (
				<Item name={dataIndex} noStyle>
					{Content}
				</Item>
			) : (
				Content
			)}
		</td>
	)
}

export default $app.memo(Index)
