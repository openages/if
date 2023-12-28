import { Form } from 'antd'

import type { DOMAttributes, ReactNode } from 'react'

interface IProps {
	name: string
	children: ReactNode
	onMouseEnter: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
	onMouseLeave: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
}

const { Item } = Form

const Index = (props: IProps) => {
	const { name, children, onMouseEnter, onMouseLeave, ...rest } = props

	return (
		<td {...rest}>
			<Item name={name} noStyle>
				{children}
			</Item>
		</td>
	)
}

export default $app.memo(Index)
