import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'

import type { HeadingTagType } from '@lexical/rich-text'
import type { MouseEvent } from 'react'

interface IProps {
	type: HeadingTagType
	text: string
	node_key: string
	visible: boolean
	active: boolean
	scrollIntoEl: (node_key: string) => void
}

const Index = (props: IProps) => {
	const { type, text, node_key, visible, active, scrollIntoEl } = props
	const type_value = useMemo(() => 6 - parseInt(type.replace('h', '')), [type])

	const onClick = useMemoizedFn((e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		scrollIntoEl(node_key)
	})

	return (
		<li className={$cx('w_100 border_box', `nav_item_${node_key}`, visible && 'visible', active && 'active')}>
			<span className='signal_wrap align_center'>
				<span className='signal inline_block' style={{ width: type_value * 3 }}></span>
			</span>
			<a onClick={onClick}>{text}</a>
		</li>
	)
}

export default $app.memo(Index)
