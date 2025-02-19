import { Input } from 'antd'
import { useTranslation } from 'react-i18next'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical, Eye, EyeSlash, Plus, Trash } from '@phosphor-icons/react'

interface IProps {
	item: { id: string; text: string }
	index: number
	limitMin: boolean
	limitMax: boolean
	exclude: boolean
	onExclude: (index: number) => void
	onAdd: (index: number) => void
	onRemove: (index: number) => void
	onUpdate: (index: number, v: string) => void
}

const Index = (props: IProps) => {
	const { item, index, limitMin, limitMax, exclude, onExclude, onAdd, onRemove, onUpdate } = props
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: item.id,
		data: { index }
	})
	const { t } = useTranslation()

	return (
		<div
			className='angle_item_wrap flex'
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<Input
				className='input'
				placeholder={t('common.angles.placeholder')}
				maxLength={15}
				value={item.text}
				onChange={({ target: { value } }) => onUpdate(index, value)}
			></Input>
			<div
				className={$cx(
					'btn border_box flex justify_center align_center clickable',
					limitMax && 'disabled'
				)}
				onClick={() => onExclude(index)}
			>
				{exclude ? <EyeSlash></EyeSlash> : <Eye></Eye>}
			</div>
			<div
				className={$cx(
					'btn border_box flex justify_center align_center clickable',
					limitMax && 'disabled'
				)}
				onClick={() => onAdd(index)}
			>
				<Plus></Plus>
			</div>
			<div
				className={$cx(
					'btn border_box flex justify_center align_center clickable',
					limitMin && 'disabled'
				)}
				onClick={() => onRemove(index)}
			>
				<Trash></Trash>
			</div>
			<div
				className='btn border_box flex justify_center align_center clickable'
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<DotsSixVertical weight='bold'></DotsSixVertical>
			</div>
		</div>
	)
}

export default $app.memo(Index)
