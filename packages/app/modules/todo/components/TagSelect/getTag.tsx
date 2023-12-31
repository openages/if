import { useMemoizedFn } from 'ahooks'

import { useTagColor } from '@/hooks'
import { X } from '@phosphor-icons/react'

import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import type { IPropsInput } from '../../types'

const Index = (tags: Required<IPropsInput['tags']>, options: { useByTodo?: boolean }) => (props: CustomTagProps) => {
	const { value, onClose } = props
	const { text, color: bg_color } = tags.find(item => item.id === value)
	const color = useTagColor(bg_color)

	const onPreventMouseDown = useMemoizedFn((e: React.MouseEvent<HTMLSpanElement>) => {
		e.preventDefault()
	})

	return (
		<div
			className='tag border_box flex justify_center align_center'
			style={{
				backgroundColor: bg_color,
				color
			}}
			onMouseDown={onPreventMouseDown}
		>
			<span className='text'>{text}</span>
			{!options?.useByTodo && (
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
