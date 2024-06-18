import { Switch } from 'antd'
import { useTranslation } from 'react-i18next'

import { ModuleIcon } from '@/components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical } from '@phosphor-icons/react'

import type { App } from '@/types'

export interface IProps {
	item: App.Module & { id: string }
	index: number
	changeIsFixed: (index: number, v: boolean) => void
}

const Index = (props: IProps) => {
	const { item, index, changeIsFixed } = props
	const { t } = useTranslation()
	const { attributes, listeners, transform, transition, isDragging, setNodeRef, setActivatorNodeRef } = useSortable(
		{
			id: item.id,
			data: { index }
		}
	)

	return (
		<div
			className={$cx('app_module_item_wrap w_100 border_box', isDragging && 'isDragging')}
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<div className='app_module_item setting_item w_100 border_box flex align_center justify_between relative'>
				<div
					className='btn_drag btn_action flex justify_end align_center absolute'
					ref={setActivatorNodeRef}
					{...attributes}
					{...listeners}
				>
					<DotsSixVertical size={16} weight='bold'></DotsSixVertical>
				</div>
				<div className='module_icon w_100 border_box flex align_center'>
					<ModuleIcon type={item.title} size={24} weight='duotone'></ModuleIcon>
					<span className='name ml_12'>{t(`translation:modules.${item.title}`)}</span>
				</div>
				<Switch size='small' checked={item.fixed} onChange={v => changeIsFixed(index, v)}></Switch>
			</div>
		</div>
	)
}

export default $app.memo(Index)
