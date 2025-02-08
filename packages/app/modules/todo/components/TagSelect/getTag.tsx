import type { IPropsInput } from '../../types'
import type { ReactNode } from 'react'

type CustomTagProps = {
	label: ReactNode
	value: any
	disabled: boolean
	closable: boolean
}

const Index = (tags: Required<IPropsInput['tags']>) => (props: CustomTagProps) => {
	const { value } = props
	const { text, color } = tags!.find(item => item.id === value) || {}

	const onPreventMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => e.preventDefault()

	return (
		<div className='tag border_box flex justify_center align_center' onMouseDown={onPreventMouseDown}>
			<span className='color' style={{ backgroundColor: color }}></span>
			<span className='text'>{text}</span>
		</div>
	)
}

export default Index
