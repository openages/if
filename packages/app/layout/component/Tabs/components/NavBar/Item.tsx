import { Button } from 'antd'
import { Else, If, Then } from 'react-if'

import { Wave, LeftIcon, ModuleIcon, Emoji } from '@/components'
import { useScrollToItem } from '@/hooks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDoubleClick } from '@openages/stk'
import { X } from '@phosphor-icons/react'

import type { IPropsTabsNavBarItem } from '@/layout/types'

const Index = (props: IPropsTabsNavBarItem) => {
	const { item, index, remove, active, update } = props
	const { attributes, listeners, transform, transition, setNodeRef } = useSortable({
		id: item.id,
		data: { index }
	})

	useScrollToItem(item.id, item.is_active)

	const fixedItem = useDoubleClick((index) => update({ index, v: { is_fixed: true } }))

	return (
		<div
			className='drag_wrap inline_block h_100'
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
			{...attributes}
			{...listeners}
		>
			<Wave>
				<Button
					className={$cx(
						'nav_bar_item_wrap h_100 border_box flex align_center',
						item.is_active && 'is_active',
						item.is_fixed && 'is_fixed'
					)}
					onMouseDown={(e) => {
						if (e.button !== 0) return

						active(index)
						fixedItem(index)
					}}
				>
					<div className='icon_wrap h_100 flex align_center'>
						<If condition={item.file.icon}>
							<Then>
								<Emoji
									shortcodes={item.file.icon}
									size={12}
									hue={item.file.icon_hue}
								></Emoji>
							</Then>
							<Else>
								<LeftIcon module={item.module} item={item.file} size={12}></LeftIcon>
							</Else>
						</If>
					</div>
					<span className='name_wrap ml_4'>{item.file.name}</span>
					<div className='icon_module_wrap flex justify_center align_center ml_2'>
						<ModuleIcon type={item.module}></ModuleIcon>
					</div>
					<div
						className='btn_remove flex justify_center align_center clickable ml_2'
						onMouseDown={(e) => e.stopPropagation()}
						onClick={() => remove(index)}
					>
						<X size={12} weight='bold'></X>
					</div>
				</Button>
			</Wave>
		</div>
	)
}

export default $app.memo(Index)
