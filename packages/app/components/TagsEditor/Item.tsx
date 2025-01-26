import { useMemoizedFn } from 'ahooks'
import { ColorPicker, Input } from 'antd'
import { debounce } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'
import { useTagColor } from '@/hooks'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical, Plus, Trash } from '@phosphor-icons/react'

import type { DndItemProps } from '@/types'

interface IProps {
	sortable_props?: DndItemProps
	item: { id: string; color: string; text: string }
	index: number
	limitMax: boolean
	pureColor?: boolean
	onAdd: (index: number) => void
	onRemove: (index: number) => void
	onUpdate: (key: 'id' | 'color' | 'text', index: number, v: string) => void
}

const Index = (props: IProps) => {
	const { sortable_props, item, index, limitMax, pureColor, onAdd, onRemove, onUpdate } = props
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = sortable_props!

	const global = useGlobal()
	const { t } = useTranslation()
	const { bg_color, text_color } = useTagColor(item.color, global.setting.theme)

	const getPopupContainer = useMemoizedFn(() => document.body)
	const onDebounceChange = useMemoizedFn(debounce((_, v) => onUpdate('color', index, v), 300))

	return (
		<div
			className='list_item_wrap flex align_center'
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<ColorPicker
				className='color_picker'
				disabledAlpha
				placement='topLeft'
				getPopupContainer={getPopupContainer}
				defaultValue={item.color}
				onChange={onDebounceChange}
			></ColorPicker>
			<Input
				className='input'
				placeholder={t('common.tags.placeholder')}
				maxLength={12}
				value={item.text}
				onChange={({ target: { value } }) => onUpdate('text', index, value)}
			></Input>
			<div className='preview_wrap border_box flex align_center transition_normal cursor_point'>
				<span className='color mr_6' style={{ backgroundColor: item.color }}></span>
				<span>{item.text || t('common.tags.placeholder')}</span>
			</div>
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
				className='btn btn_remove border_box flex justify_center align_center clickable'
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
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
