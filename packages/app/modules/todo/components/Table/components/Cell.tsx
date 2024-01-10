import { Form } from 'antd'
import { xxHash32 } from 'js-xxhash'
import { useMemo } from 'react'
import genColor from 'uniqolor'

import styles from '../index.css'

import type { DOMAttributes, ReactNode, CSSProperties } from 'react'

interface IProps {
	name: string
	archive: boolean
	status: false | { linked: string | undefined; done: boolean }
	className: string
	children: ReactNode
	style: CSSProperties
	onMouseEnter: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
	onMouseLeave: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
}

const { Item } = Form

const Index = (props: IProps) => {
	const { name, archive, status, className, children, style, onMouseEnter, onMouseLeave, ...rest } = props

	const target_style = useMemo(
		() =>
			status && status.linked
				? {
						'--color_relation_group': genColor(xxHash32(status.linked).toString(3), {
							saturation: 72,
							lightness: [30, 72]
						}).color,
						...style
				  }
				: style,
		[status, style]
	)

	return (
		<td
			{...rest}
			className={$cx(
				className,
				archive && styles.archive,
				status && status.done && styles.done,
				target_style['--color_relation_group'] && styles.linked
			)}
			style={target_style}
		>
			<Item name={name} noStyle>
				{children}
			</Item>
		</td>
	)
}

export default $app.memo(Index)
