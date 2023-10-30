import { useMemoizedFn } from 'ahooks'
import Color from 'color'

import { X } from '@phosphor-icons/react'

import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import type { IPropsInput } from '../../types'

const Index = (tags: Required<IPropsInput['tags']>, useByTodo?: boolean) => (props: CustomTagProps) => {
	const { value, onClose } = props
	const { text, color } = tags.find((item) => item.id === value)

	const onPreventMouseDown = useMemoizedFn((event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault()
	})

	return (
		<div
			className='tag border_box flex justify_center align_center'
			style={{
				backgroundColor: color ? Color(color).alpha(0.3).toString() : '',
				color: color
			}}
			onMouseDown={onPreventMouseDown}
		>
			<span className='text'>{text}</span>
			{!useByTodo && (
				<span
					className='btn_close h_100 border_box flex justify_center align_center cursor_point'
					onClick={onClose}
				>
					<X size={10}></X>
				</span>
			)}
		</div>
	)
}

export default Index
