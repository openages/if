import { Input, ColorPicker } from 'antd'
import Color from 'color'
import { useTranslation } from 'react-i18next'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash, DotsSixVertical } from '@phosphor-icons/react'

interface IProps {
	item: { id: string; color: string; text: string }
	index: number
	limitMax: boolean
	onAdd: (index: number) => void
	onRemove: (index: number) => void
	onUpdate: (key: string, index: number, v: string) => void
}

const Index = (props: IProps) => {
	const { item, index, limitMax, onAdd, onRemove, onUpdate } = props
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: item.id,
		data: { index }
	})
	const { t } = useTranslation()

	return (
		<div
			className='list_item_wrap flex'
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<ColorPicker
				className='color_picker clickable mr_6'
				disabledAlpha
				placement='topLeft'
				value={item.color}
				onChange={(_, v) => onUpdate('color', index, v)}
			></ColorPicker>
			<Input
				className='input'
				placeholder={t('translation:todo.SettingsModal.tags.placeholder')}
				maxLength={12}
				value={item.text}
				onChange={({ target: { value } }) => onUpdate('text', index, value)}
			></Input>
			<div className='preview_wrap border_box flex justify_center align_center ml_6 transition_normal cursor_point'>
				<span
					className='tag w_100 h_100 flex justify_center align_center transition_normal'
					style={{
						// @ts-ignore
						'--tag_hover_color': item.color ? Color(item.color).alpha(0.42).toString() : '',
						backgroundColor: item.color ? Color(item.color).alpha(0.3).toString() : '',
						color: item.color
					}}
				>
					{item.text || t('translation:todo.SettingsModal.tags.placeholder')}
				</span>
			</div>
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
				className='btn btn_remove border_box flex justify_center align_center clickable ml_6'
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
