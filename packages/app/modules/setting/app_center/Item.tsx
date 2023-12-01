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
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: item.id,
		data: { index }
	})

	return (
		<div
			className='app_module_item_wrap border_box'
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<div className='app_module_item w_100 border_box flex flex_column align_center relative'>
				<div
					className='btn_drag flex justify_end align_center absolute'
					ref={setActivatorNodeRef}
					{...attributes}
					{...listeners}
				>
					<DotsSixVertical size={16} weight='bold'></DotsSixVertical>
				</div>
				<div className='module_icon w_100 border_box flex flex_column align_center'>
					<ModuleIcon type={item.title} size={36} weight='duotone'></ModuleIcon>
					<span className='name mt_4'>{t(`translation:modules.${item.title}`)}</span>
				</div>
				<div className='toggle_wrap w_100 border_box flex justify_between align_center'>
					<span className='label'>{t('translation:setting.Menu.fixed')}</span>
					<Switch
						size='small'
						checked={item.is_fixed}
						onChange={v => changeIsFixed(index, v)}
					></Switch>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
