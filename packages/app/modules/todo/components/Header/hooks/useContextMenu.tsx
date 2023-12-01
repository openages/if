import { uniq } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	PencilSimple,
	Note,
	GitFork,
	Star,
	ArrowsDownUp,
	TextAa,
	CalendarPlus,
	Tag,
	Question
} from '@phosphor-icons/react'

import type { MenuProps } from 'antd'
import type { IPropsHeader } from '../../../types'

interface HookArgs {
	tags: IPropsHeader['tags']
	items_filter_tags: IPropsHeader['items_filter_tags']
	showSettingsModal: IPropsHeader['showSettingsModal']
	showHelpModal: IPropsHeader['showHelpModal']
	setItemsSortParam: IPropsHeader['setItemsSortParam']
	setItemsFilterTags: IPropsHeader['setItemsFilterTags']
}

export default (args: HookArgs) => {
	const { tags, items_filter_tags, showSettingsModal, showHelpModal, setItemsSortParam, setItemsFilterTags } = args
	const { t, i18n } = useTranslation()

	const related_menu: MenuProps['items'] = useMemo(
		() => [
			{
				key: 'reference',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Note size={16}></Note>
						<span className='text ml_6'>{t('translation:todo.Header.related.reference')}</span>
					</div>
				)
			},
			{
				key: 'todograph',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<GitFork size={16}></GitFork>
						<span className='text ml_6'>{t('translation:todo.Header.related.todograph')}</span>
					</div>
				)
			}
		],
		[i18n.language]
	)

	const options_menu: MenuProps['items'] = useMemo(
		() => [
			{
				key: 'edit',
				label: (
					<div className='menu_item_wrap flex align_center' onClick={showSettingsModal}>
						<PencilSimple size={16}></PencilSimple>
						<span className='text ml_6'>{t('translation:todo.Header.options.edit')}</span>
					</div>
				)
			},
			{
				key: 'sort',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<ArrowsDownUp size={16}></ArrowsDownUp>
						<span className='text ml_6'>{t('translation:todo.Header.options.sort.text')}</span>
					</div>
				),
				children: [
					{
						key: 'importance',
						label: (
							<div
								className='menu_item_wrap flex align_center'
								onClick={() => setItemsSortParam({ type: 'importance', order: 'desc' })}
							>
								<Star size={16}></Star>
								<span className='text ml_6'>
									{t('translation:todo.Header.options.sort.importance')}
								</span>
							</div>
						)
					},
					{
						key: 'alphabetical',
						label: (
							<div
								className='menu_item_wrap flex align_center'
								onClick={() =>
									setItemsSortParam({ type: 'alphabetical', order: 'asc' })
								}
							>
								<TextAa size={16}></TextAa>
								<span className='text ml_6'>
									{t('translation:todo.Header.options.sort.alphabetical')}
								</span>
							</div>
						)
					},
					{
						key: 'create_at',
						label: (
							<div
								className='menu_item_wrap flex align_center'
								onClick={() => setItemsSortParam({ type: 'create_at', order: 'asc' })}
							>
								<CalendarPlus size={16}></CalendarPlus>
								<span className='text ml_6'>
									{t('translation:todo.Header.options.sort.create_at')}
								</span>
							</div>
						)
					}
				]
			},
			{
				key: 'tags',
				disabled: !tags?.length,
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Tag size={16}></Tag>
						<span className='text ml_6'>{t('translation:todo.Header.options.tags')}</span>
					</div>
				),
				children: tags?.map(item => ({
					key: item.id,
					label: (
						<div
							className='menu_item_wrap'
							onClick={() => setItemsFilterTags(uniq([...items_filter_tags, item.id]))}
						>
							{item.text}
						</div>
					)
				}))
			},
			{
				key: 'help',
				label: (
					<div className='menu_item_wrap flex align_center' onClick={showHelpModal}>
						<Question size={16}></Question>
						<span className='text ml_6'>{t('translation:todo.Header.options.help')}</span>
					</div>
				)
			}
		],
		[i18n.language, tags, items_filter_tags]
	)

	return { related_menu, options_menu }
}
