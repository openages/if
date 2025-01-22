import { useMemoizedFn } from 'ahooks'

import type { IPropsInput } from '../../types'
import type { ReactNode, MouseEvent } from 'react'
import type { Theme } from '@/appdata'

type CustomTagProps = {
	label: ReactNode
	value: any
	disabled: boolean
	closable: boolean
	onClose: (event?: MouseEvent<HTMLSpanElement>) => void
}

const Index =
	(tags: Required<IPropsInput['tags']>, options: { useByTodo?: boolean; theme: Theme }) =>
	(props: CustomTagProps) => {
		const { value, onClose } = props
		const { text, color } = tags!.find(item => item.id === value) || {}

		const onPreventMouseDown = useMemoizedFn((e: React.MouseEvent<HTMLSpanElement>) => {
			e.preventDefault()
		})

		return (
			<div className='tag border_box flex align_center' onMouseDown={onPreventMouseDown}>
				<span className='color' style={{ backgroundColor: color }}></span>
				<span className='text'>{text}</span>
			</div>
		)
	}

export default Index
