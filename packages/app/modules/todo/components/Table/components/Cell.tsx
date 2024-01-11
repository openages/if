import { Form } from 'antd'
import { xxHash32 } from 'js-xxhash'
import { cloneElement, useMemo, Children } from 'react'
import genColor from 'uniqolor'

import styles from '../index.css'

import type { DOMAttributes, ReactElement, CSSProperties } from 'react'

interface IProps {
	name: string
	archive: boolean
	status: false | { linked: string | undefined; done: boolean }
	className: string
	children: Array<ReactElement>
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

	const target_children = useMemo(() => {
		const filter_children = children.filter(item => item)

		if (name === 'status') {
			return Children.map(filter_children, child =>
				cloneElement(child, { linked: status ? status.linked : undefined })
			)
		}

		return filter_children
	}, [name, status, children])

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
				{target_children}
			</Item>
		</td>
	)
}

export default $app.memo(Index)
