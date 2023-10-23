import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TextIndent, Plus, AlignCenterHorizontal, Trash } from '@phosphor-icons/react'

export default () => {
	const { t, i18n } = useTranslation()

	const TodoContextMenu = useMemo(
		() => [
			{
				key: 'detail',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<TextIndent size={16}></TextIndent>
						<span className='text ml_6'>{t('translation:todo.context_menu.detail')}</span>
					</div>
				)
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
				key: 'remove',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Trash size={16}></Trash>
						<span className='text ml_6'>{t('translation:todo.context_menu.remove')}</span>
					</div>
				)
			}
		],
		[i18n.language]
	)

	const ChildrenContextMenu = useMemo(
		() => [
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
				key: 'remove',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Trash size={16}></Trash>
						<span className='text ml_6'>{t('translation:todo.context_menu.remove')}</span>
					</div>
				)
			}
		],
		[i18n.language]
	)

	return { TodoContextMenu, ChildrenContextMenu }
}
