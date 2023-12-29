import { Form } from 'antd'

import styles from '../index.css'

import type { DOMAttributes, ReactNode } from 'react'

interface IProps {
	name: string
	archive: boolean
	className: string
	children: ReactNode
	onMouseEnter: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
	onMouseLeave: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
}

const { Item } = Form

const Index = (props: IProps) => {
	const { name, archive, className, children, onMouseEnter, onMouseLeave, ...rest } = props

	return (
		<td {...rest} className={$cx(className, archive && styles.archive)}>
			<Item name={name} noStyle>
				{children}
			</Item>
		</td>
	)
}

export default $app.memo(Index)
