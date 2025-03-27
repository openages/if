import { Emoji, LeftIcon, ModuleIcon } from '@/components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Star } from '@phosphor-icons/react'

import type { IPropsHomeDrawerFilesItem } from '@/layout/types'
import type { App } from '@/types'

const Index = (props: IPropsHomeDrawerFilesItem) => {
	const { tab, item, setStar, onFile } = props
	const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
		id: item.id
	})

	return (
		<div
			className={$cx(
				'file_item w_100 border_box flex align_center cursor_point',
				tab === 'star' && 'star_item',
				isDragging && 'dragging'
			)}
			onClick={() => onFile(item)}
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			{...attributes}
			{...listeners}
		>
			<div className='left_icon_wrap flex justify_center align_center'>
				<Choose>
					<When condition={!!item.icon}>
						<Emoji shortcodes={item.icon!} size={16} hue={item.icon_hue}></Emoji>
					</When>
					<Otherwise>
						<LeftIcon module={item.module as App.ModuleType} item={item}></LeftIcon>
					</Otherwise>
				</Choose>
			</div>
			<div className='title_wrap flex align_center'>{item.name}</div>
			<div className='icon_module_wrap flex justify_center align_center ml_6'>
				<ModuleIcon type={item.module as App.ModuleType}></ModuleIcon>
			</div>
			<If condition={tab === 'star'}>
				<div
					className='star_icon_wrap none align_center clickable ml_4'
					onClick={e => {
						e.stopPropagation()

						setStar(item.id)
					}}
				>
					<Star size={12} weight='fill' />
				</div>
			</If>
		</div>
	)
}

export default $app.memo(Index)
