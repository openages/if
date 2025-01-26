import { Input } from 'antd'
import { useTranslation } from 'react-i18next'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AlignCenterHorizontalSimple, DotsSixVertical, ListPlus, Plus, Trash, X } from '@phosphor-icons/react'

import styles from './index.css'

import type { Schedule } from '@/types'

interface IProps {
	item: Schedule.TimelineAngle
	index: number
	limitMin: boolean
	limitMax: boolean
	last: boolean
	onAdd: (index: number) => void
	onAddRow: (index: number) => void
	onRemove: (index: number) => void
	onRemoveRow: (index: number, row_id: number) => void
	onUpdate: (index: number, v: string) => void
}

const Index = (props: IProps) => {
	const { item, index, limitMin, limitMax, last, onAdd, onAddRow, onRemove, onRemoveRow, onUpdate } = props
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: item.id,
		data: { index }
	})
	const { t } = useTranslation()

	return (
		<div
			className={$cx('w_100 border_box flex flex_column', styles.Item, last && styles.last)}
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<div className='timeline_angle w_100 flex mb_6'>
				<Input
					className='input'
					placeholder={t('common.angles.placeholder')}
					maxLength={12}
					value={item.text}
					onChange={({ target: { value } }) => onUpdate(index, value)}
				></Input>
				<div
					className={$cx(
						'btn btn_add border_box flex justify_center align_center clickable',
						limitMax && 'disabled'
					)}
					onClick={() => onAdd(index)}
				>
					<Plus></Plus>
				</div>
				<div
					className={$cx(
						'btn btn_add border_box flex justify_center align_center clickable',
						(item.rows.length >= 6 || item.rows.length === 1) && 'disabled'
					)}
					onClick={() => onAddRow(index)}
				>
					<ListPlus></ListPlus>
				</div>
				<div
					className={$cx(
						'btn btn_remove border_box flex justify_center align_center clickable',
						limitMin && 'disabled'
					)}
					onClick={() => onRemove(index)}
				>
					<Trash></Trash>
				</div>
				<div
					className='btn btn_move border_box flex justify_center align_center clickable'
					ref={setActivatorNodeRef}
					{...attributes}
					{...listeners}
				>
					<DotsSixVertical weight='bold'></DotsSixVertical>
				</div>
			</div>
			<div className='rows_wrap w_100 flex'>
				{item.rows.map((i, row_index) => (
					<span
						className='row_item border_box flex justify_center align_center mr_6 clickable'
						key={i}
						onClick={() => onRemoveRow(index, row_index)}
					>
						<X className='icon_remove none'></X>
						<AlignCenterHorizontalSimple
							className='icon_row'
							size={15}
							weight='duotone'
						></AlignCenterHorizontalSimple>
					</span>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
