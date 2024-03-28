import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Plus, TextOutdent, Trash } from '@phosphor-icons/react'

import type { MenuProps } from 'antd'
import type { IPropsTodoItem, IPropsDetail } from '../types'

type HookArgs = {
	mode?: IPropsDetail['mode']
	kanban_mode?: IPropsTodoItem['kanban_mode']
}

export default (args: HookArgs) => {
	const { mode, kanban_mode } = args
	const { t, i18n } = useTranslation()

	return useMemo(
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
					disabled: mode === 'table' || kanban_mode === 'tag',
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
		[i18n.language, mode, kanban_mode]
	)
}
