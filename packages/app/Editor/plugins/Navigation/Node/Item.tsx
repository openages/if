import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'

import styles from './index.css'

import type { HeadingTagType } from '@lexical/rich-text'
import type { MouseEvent } from 'react'

interface IProps {
	type: HeadingTagType
	text: string
	node_key: string
	max_type_value: number
	scrollIntoEl: (node_key: string) => void
}

const Index = (props: IProps) => {
	const { type, text, node_key, max_type_value, scrollIntoEl } = props
	const type_value = useMemo(() => parseInt(type.replace('h', '')), [type])
	const padding_left = (type_value - max_type_value) * 18 + 15

	const onClick = useMemoizedFn((e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		scrollIntoEl(node_key)
	})

	return (
		<li
			className={$cx(styles.item)}
			style={{
				'--padding_left': padding_left - 12 + 'px',
				paddingLeft: padding_left
			}}
		>
			<a onClick={onClick}>{text}</a>
		</li>
	)
}

export default $app.memo(Index)
