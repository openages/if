import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	Notepad,
	TextIndent,
	Plus,
	AlignCenterHorizontal,
	Trash,
	ArrowsOutCardinal,
	TextOutdent
} from '@phosphor-icons/react'

import type { IPropsTodoItem } from '../../../types'
import type { MenuProps } from 'antd'

type HookArgs = {
	angles: IPropsTodoItem['angles']
}

export default (args: HookArgs) => {
	const { angles } = args
	const { t, i18n } = useTranslation()

	const TodoContextMenu = useMemo(
		() =>
			[
				{
					key: 'detail',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Notepad size={16}></Notepad>
							<span className='text ml_6'>{t('translation:todo.context_menu.detail')}</span>
						</div>
					)
				},
				{
					type: 'divider'
				},
				{
					key: 'insert',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Plus size={16}></Plus>
							<span className='text ml_6'>{t('translation:todo.context_menu.insert')}</span>
						</div>
					)
                        },
                        {
					key: 'insert_children',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<AlignCenterHorizontal size={16}></AlignCenterHorizontal>
							<span className='text ml_6'>
								{t('translation:todo.context_menu.insert_children')}
							</span>
						</div>
					)
				},
				{
					key: 'move_into',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<TextIndent size={16}></TextIndent>
							<span className='text ml_6'>
								{t('translation:todo.context_menu.move_into')}
							</span>
						</div>
					)
                        },
				{
					key: 'move',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<ArrowsOutCardinal size={16}></ArrowsOutCardinal>
							<span className='text ml_6'>{t('translation:todo.context_menu.move')}</span>
						</div>
					),
					children: angles.map((item) => ({
						key: item.id,
						label: (
							<div className='menu_item_wrap flex align_center'>
								<span className='text'>{item.text}</span>
							</div>
						)
					}))
				},
				{
					type: 'divider'
				},
				{
					key: 'remove',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Trash size={16}></Trash>
							<span className='text ml_6'>{t('translation:todo.context_menu.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language]
	)

	const ChildrenContextMenu = useMemo(
		() =>
			[
				{
					key: 'insert',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Plus size={16}></Plus>
							<span className='text ml_6'>{t('translation:todo.context_menu.insert')}</span>
						</div>
					)
				},
				{
					key: 'move_out',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<TextOutdent size={16}></TextOutdent>
							<span className='text ml_6'>
								{t('translation:todo.context_menu.move_out')}
							</span>
						</div>
					)
				},
				{
					type: 'divider'
				},
				{
					key: 'remove',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Trash size={16}></Trash>
							<span className='text ml_6'>{t('translation:todo.context_menu.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language]
	)

	return { TodoContextMenu, ChildrenContextMenu }
}
