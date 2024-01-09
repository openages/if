import { Form } from 'antd'
import { xxHash32 } from 'js-xxhash'
import { useMemo } from 'react'
import genColor from 'uniqolor'

import styles from '../index.css'

import type { DOMAttributes, ReactNode, CSSProperties } from 'react'

interface IProps {
	name: string
	archive: boolean
	disabled: boolean | string
	className: string
	children: ReactNode
	style: CSSProperties
	onMouseEnter: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
	onMouseLeave: DOMAttributes<HTMLTableCellElement>['onMouseEnter']
}

const { Item } = Form

const Index = (props: IProps) => {
	const { name, archive, disabled, className, children, style, onMouseEnter, onMouseLeave, ...rest } = props

	const target_style = useMemo(
		() =>
			typeof disabled === 'string'
				? {
						'--color_relation_group': genColor(xxHash32(disabled).toString(16), {
							saturation: 72,
							lightness: [48, 100]
						}).color,
						...style
				  }
				: style,
		[disabled, style]
	)

	return (
		<td
			{...rest}
			className={$cx(
				className,
				archive && styles.archive,
				disabled && styles.disabled,
				Object.keys(style).length && styles.linked
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
