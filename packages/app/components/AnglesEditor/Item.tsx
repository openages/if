import { Input } from 'antd'
import { useTranslation } from 'react-i18next'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical, Plus, Trash } from '@phosphor-icons/react'

interface IProps {
	item: { id: string; text: string }
	index: number
	limitMin: boolean
	limitMax: boolean
	onAdd: (index: number) => void
	onRemove: (index: number) => void
	onUpdate: (index: number, v: string) => void
}

const Index = (props: IProps) => {
	const { item, index, limitMin, limitMax, onAdd, onRemove, onUpdate } = props
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
					'btn btn_add border_box flex justify_center align_center clickable ml_6',
					limitMax && 'disabled'
				)}
				onClick={() => onAdd(index)}
			>
				<Plus size={18}></Plus>
			</div>
			<div
				className={$cx(
					'btn btn_remove border_box flex justify_center align_center clickable ml_6',
					limitMin && 'disabled'
				)}
				onClick={() => onRemove(index)}
			>
				<Trash size={18}></Trash>
			</div>
			<div
				className='btn btn_move border_box flex justify_center align_center clickable ml_6'
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<DotsSixVertical size={18} weight='bold'></DotsSixVertical>
			</div>
		</div>
	)
}

export default $app.memo(Index)
