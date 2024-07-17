import { useMemoizedFn } from 'ahooks'

import { useTagColor } from '@/hooks'
import { X } from '@phosphor-icons/react'

import type { IPropsInput } from '../../types'
import type { ReactNode, MouseEvent } from 'react'

type CustomTagProps = {
	label: ReactNode
	value: any
	disabled: boolean
	closable: boolean
	onClose: (event?: MouseEvent<HTMLSpanElement>) => void
}

const Index = (tags: Required<IPropsInput['tags']>, options: { useByTodo?: boolean }) => (props: CustomTagProps) => {
	const { value, onClose } = props
	const { text, color } = tags.find(item => item.id === value) || {}
	const { bg_color, text_color } = useTagColor(color)

	const onPreventMouseDown = useMemoizedFn((e: React.MouseEvent<HTMLSpanElement>) => {
		e.preventDefault()
	})

	return (
		<div
			className='tag border_box flex justify_center align_center'
			style={{
				backgroundColor: bg_color,
				color: text_color
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
