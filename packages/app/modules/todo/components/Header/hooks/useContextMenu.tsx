import { useMemoizedFn } from 'ahooks'
import { uniq } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	ArchiveBox,
	ArrowsDownUp,
	CalendarPlus,
	GearSix,
	GitFork,
	Kanban,
	ListChecks,
	Star,
	Table,
	Tag,
	TextAa
} from '@phosphor-icons/react'

import type { MenuProps } from 'antd'
import type { IPropsHeader } from '../../../types'

interface HookArgs {
	tags: IPropsHeader['tags']
	mode: IPropsHeader['mode']
	items_filter_tags: IPropsHeader['items_filter_tags']
	setMode: IPropsHeader['setMode']
	showSettingsModal: IPropsHeader['showSettingsModal']
	showArchiveModal: IPropsHeader['showArchiveModal']
	showHelpModal: IPropsHeader['showHelpModal']
	setItemsSortParam: IPropsHeader['setItemsSortParam']
	setItemsFilterTags: IPropsHeader['setItemsFilterTags']
}

export default (args: HookArgs) => {
	const {
		tags,
		mode,
		items_filter_tags,
		setMode,
		showSettingsModal,
		showArchiveModal,
		showHelpModal,
		setItemsSortParam,
		setItemsFilterTags
	} = args
	const { t, i18n } = useTranslation()

	const options_mode: MenuProps['items'] = useMemo(() => {
		const options = [
			{
				key: 'list',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<ListChecks size={16}></ListChecks>
						<span className='text ml_6'>{t('todo.Header.mode.list')}</span>
					</div>
				)
			},
			{
				key: 'kanban',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Kanban size={16}></Kanban>
						<span className='text ml_6'>{t('todo.Header.mode.kanban')}</span>
					</div>
				)
			},
			{
				key: 'table',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Table size={16}></Table>
						<span className='text ml_6'>{t('todo.Header.mode.table')}</span>
					</div>
				)
			},
			{
				key: 'mindmap',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<GitFork size={16}></GitFork>
						<span className='text ml_6'>{t('todo.Header.mode.mindmap')}</span>
					</div>
				)
			}
		]

		return options.filter(item => item.key !== mode)
	}, [i18n.language, mode])

	const onModeContextMenu = useMemoizedFn(({ key }) => setMode(key))

	const options_menu: MenuProps['items'] = useMemo(
		() => [
			{
				key: 'setting',
				disabled: mode === 'kanban',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<GearSix size={16}></GearSix>
						<span className='text ml_6'>{t('common.setting')}</span>
					</div>
				)
			},
			{
				key: 'archive',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<ArchiveBox size={16}></ArchiveBox>
						<span className='text ml_6'>{t('todo.Header.options.archive')}</span>
					</div>
				)
			},
			{
				key: 'sort',
				disabled: mode !== 'list',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<ArrowsDownUp size={16}></ArrowsDownUp>
						<span className='text ml_6'>{t('todo.Header.options.sort.text')}</span>
					</div>
				),
				children: [
					{
						key: 'importance',
						label: (
							<div className='menu_item_wrap flex align_center'>
								<Star size={16}></Star>
								<span className='text ml_6'>
									{t('todo.Header.options.sort.importance')}
								</span>
							</div>
						)
					},
					{
						key: 'alphabetical',
						label: (
							<div className='menu_item_wrap flex align_center'>
								<TextAa size={16}></TextAa>
								<span className='text ml_6'>
									{t('todo.Header.options.sort.alphabetical')}
								</span>
							</div>
						)
					},
					{
						key: 'create_at',
						label: (
							<div className='menu_item_wrap flex align_center'>
								<CalendarPlus size={16}></CalendarPlus>
								<span className='text ml_6'>
									{t('todo.Header.options.sort.create_at')}
								</span>
							</div>
						)
					}
				]
			},
			{
				key: 'tags',
				disabled: !tags?.length || mode !== 'list',
				label: (
					<div className='menu_item_wrap flex align_center'>
						<Tag size={16}></Tag>
						<span className='text ml_6'>{t('todo.Header.options.tags')}</span>
					</div>
				),
				children: tags?.map(item => ({
					key: item.id,
					label: <div className='menu_item_wrap'>{item.text}</div>
				}))
			}
		],
		[i18n.language, mode, tags, items_filter_tags]
	)

	const onOptionsContextMenu = useMemoizedFn(({ key, keyPath }) => {
		if (keyPath.length > 1) {
			const parent_key = keyPath.at(-1)
			const target_key = keyPath.at(0)

			if (parent_key === 'sort') {
				switch (target_key) {
					case 'importance':
						setItemsSortParam({ type: 'importance', order: 'desc' })
						break
					case 'alphabetical':
						setItemsSortParam({ type: 'alphabetical', order: 'asc' })
						break
					case 'create_at':
						setItemsSortParam({ type: 'create_at', order: 'desc' })
						break
				}
			}

			if (parent_key === 'tags') {
				setItemsFilterTags(uniq([...items_filter_tags, target_key]))
			}
		} else {
			switch (key) {
				case 'setting':
					showSettingsModal()
					break
				case 'archive':
					showArchiveModal()
					break
				case 'help':
					showHelpModal()
					break
			}
		}
	})

	return { options_mode, options_menu, onModeContextMenu, onOptionsContextMenu }
}
