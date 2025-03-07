import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	AlignCenterHorizontal,
	ArrowsOutCardinal,
	CellSignalHigh,
	Check,
	Dna,
	Notepad,
	Plus,
	Tag,
	TextIndent,
	Trash
} from '@phosphor-icons/react'

import Option from '../components/Level/Option'

import type { MenuProps } from 'antd'
import type { IPropsTodoItem } from '../types'

type HookArgs = {
	item: IPropsTodoItem['item']
	angles?: IPropsTodoItem['angles']
	tags?: IPropsTodoItem['tags']
	tag_ids?: IPropsTodoItem['item']['tag_ids']
}

export default (args: HookArgs) => {
	const { item, angles, tags, tag_ids } = args
	const { level } = item
	const { t, i18n } = useTranslation()

	const options_level = useMemo(
		() => [
			{ label: t('common.prority.no'), value: 0 },
			{ label: t('common.prority.low'), value: 1 },
			{ label: t('common.prority.medium'), value: 2 },
			{ label: t('common.prority.high'), value: 3 },
			{ label: t('common.prority.urgent'), value: 4 }
		],
		[t]
	)

	return useMemo(
		() =>
			[
				{
					key: 'detail',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Notepad size={16}></Notepad>
							<span className='text ml_6'>{t('todo.context_menu.detail')}</span>
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
							<span className='text ml_6'>{t('todo.context_menu.insert')}</span>
						</div>
					)
				},
				{
					key: 'change_level',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<CellSignalHigh size={16} style={{ translate: '1px' }}></CellSignalHigh>
							<span className='text ml_6'>{t('todo.context_menu.change_level')}</span>
						</div>
					),
					children: options_level.map(item => ({
						key: item.value,
						label: (
							<Option
								label={item.label}
								value={item.value}
								selected={item.value === level}
							></Option>
						)
					}))
				},
				{
					key: 'add_tags',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Tag size={16}></Tag>
							<span className='text ml_6'>{t('todo.context_menu.add_tags')}</span>
						</div>
					),
					disabled: !tags?.length,
					children: tags?.map(item => ({
						key: item.id,
						label: (
							<div
								className={$cx(
									'menu_item_wrap flex align_center',
									tag_ids?.includes(item.id) && 'selected'
								)}
							>
								<span className='text'>{item.text}</span>
								{tag_ids?.includes(item.id) && (
									<Check className='icon_selected absolute' size={16}></Check>
								)}
							</div>
						)
					}))
				},
				{
					key: 'clone',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Dna size={16}></Dna>
							<span className='text ml_6'>{t('common.clone')}</span>
						</div>
					)
				},
				{
					key: 'insert_children',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<AlignCenterHorizontal size={16}></AlignCenterHorizontal>
							<span className='text ml_6'>{t('todo.context_menu.insert_children')}</span>
						</div>
					)
				},
				{
					key: 'move_into',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<TextIndent size={16}></TextIndent>
							<span className='text ml_6'>{t('todo.context_menu.move_into')}</span>
						</div>
					)
				},
				{
					key: 'move',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<ArrowsOutCardinal size={16}></ArrowsOutCardinal>
							<span className='text ml_6'>{t('todo.context_menu.move')}</span>
						</div>
					),
					children: angles?.map(item => ({
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
							<span className='text ml_6'>{t('todo.context_menu.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language, angles, tags, tag_ids]
	)
}
