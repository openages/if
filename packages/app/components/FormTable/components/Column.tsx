import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { cloneElement } from 'react'

import { useStyle } from '../hooks'

import type { IPropsColumn, Component } from '../types'
import type { ReactElement } from 'react'

const { Item } = Form

const Field = $app.memo((props: Pick<IPropsColumn, 'component'> & Component<any>) => {
	const { component, value, row_index, dataIndex, deps, extra, getProps, onAction, onChange } = props

	const change = useMemoizedFn(onChange)

	return cloneElement(component as ReactElement, {
		value,
		row_index,
		dataIndex,
		deps,
		extra,
		getProps,
		onAction,
		onChange: change
	})
})

const Index = (props: IPropsColumn) => {
	const { row_index, dataIndex, deps, component, align, fixed, extra, stickyOffset, shadow, getProps, onAction } =
		props
	const style = useStyle({ align, fixed, stickyOffset })

	return (
		<td
			className={$cx(
				'form_table_td',
				shadow && 'shadow',
				shadow && (shadow === 'start' ? 'shadow_start' : 'shadow_end')
			)}
			style={style}
		>
			<Item name={dataIndex} noStyle>
				<Field {...{ component, row_index, dataIndex, deps, extra, getProps, onAction }}></Field>
			</Item>
		</td>
	)
}

export default $app.memo(Index)
