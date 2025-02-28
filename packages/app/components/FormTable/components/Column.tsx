import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { cloneElement, useEffect, useRef, useState } from 'react'

import { useDeepMemo } from '@openages/stk/react'

import { useStyle } from '../hooks'

import type { IPropsColumn, Component } from '../types'
import type { ReactElement } from 'react'

const { Item } = Form

type Props = Pick<IPropsColumn, 'component' | 'useRowChange'> & Component<any>

const Field = $app.memo((props: Props) => {
	const {
		component,
		value,
		row_index,
		dataIndex,
		deps,
		extra,
		editing,
		useRowChange,
		onFocus,
		onBlur,
		getProps,
		onAction,
		onChange,
		onRowChange
	} = props

	const change = useMemoizedFn(onChange ? onChange : () => {})

	const props_component: Component<any> = {
		value,
		row_index,
		dataIndex,
		deps,
		extra,
		editing,
		onFocus,
		onBlur,
		getProps,
		onAction,
		onChange: change
	}

	if (useRowChange) props_component['onRowChange'] = onRowChange

	return cloneElement(component as ReactElement, props_component)
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
		alwaysEditing,
		disableEditing,
		focus,
		useRowChange,
		setEditingField,
		getProps,
		onAction,
		onRowChange
	} = props
	const style = useStyle({ align, fixed, stickyOffset })
	const ref = useRef<HTMLTableCellElement>(null)
	const [hover, setHover] = useState(false)

	useEffect(() => {
		const td = ref.current

		if (!td || alwaysEditing || disableEditing) return

		const setHoverTrue = () => setHover(true)
		const setHoverFalse = () => setHover(false)

		td.addEventListener('mouseenter', setHoverTrue)
		td.addEventListener('mouseleave', setHoverFalse)

		return () => {
			td.removeEventListener('mouseenter', setHoverTrue)
			td.removeEventListener('mouseleave', setHoverFalse)
		}
	}, [alwaysEditing, disableEditing])

	const onFocus = useMemoizedFn(v => {
		if (v === undefined || v) {
			setEditingField!({ field: dataIndex, focus: true })
		} else {
			setEditingField!(null)
		}
	})

	const onBlur = useMemoizedFn(() => setEditingField!(null))

	const props_field: Props = {
		component,
		row_index,
		dataIndex,
		deps,
		extra,
		editing: focus || hover,
		useRowChange,
		getProps,
		onAction,
		onRowChange
	}

	if (props_field.editing) {
		props_field['onFocus'] = onFocus
		props_field['onBlur'] = onBlur
	} else {
		props_field['value'] = value
	}

	const Content = useDeepMemo(() => <Field {...props_field}></Field>, [props_field])

	return (
		<td
			className={$cx(
				'form_table_td',
				shadow && 'shadow',
				shadow && (shadow === 'start' ? 'shadow_start' : 'shadow_end'),
				sorting && 'sorting'
			)}
			style={style}
			ref={ref}
		>
			{props_field.editing ? (
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
