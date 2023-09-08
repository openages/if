import { useMemoizedFn } from 'ahooks'
import Color from 'color'

import { X } from '@phosphor-icons/react'

import type { CustomTagProps } from 'rc-select/lib/BaseSelect'

const Index = (props: CustomTagProps) => {
	const { label, value, onClose } = props
	const { color } = JSON.parse(value)

	const onPreventMouseDown = useMemoizedFn((event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault()
		event.stopPropagation()
	})

	return (
		<div
			className='tag flex justify_center align_center'
			style={{
				backgroundColor: color ? Color(color).alpha(0.3).toString() : '',
				color: color
			}}
			onMouseDown={onPreventMouseDown}
		>
			<span className='text'>{label}</span>
			<span className='btn_close h_100 flex justify_center align_center cursor_point' onClick={onClose}>
				<X size={10}></X>
			</span>
		</div>
	)
}

export default Index
