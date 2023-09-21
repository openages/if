import { Tooltip, Dropdown, ConfigProvider } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { Emoji } from '@/components'
import {
	PencilSimple,
	Files,
	ArchiveBox,
	Note,
	GitFork,
	DotsThreeCircleVertical,
	Star,
	ArrowsDownUp,
	TextAa,
	CalendarPlus
} from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeader } from '../../types'
import type { MenuProps } from 'antd'

const Index = (props: IPropsHeader) => {
	const { name, icon, icon_hue, desc, showSettingsModal, showArchiveModal } = props
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
							<div className='menu_item_wrap flex align_center'>
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
							<div className='menu_item_wrap flex align_center'>
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
							<div className='menu_item_wrap flex align_center'>
								<CalendarPlus size={16}></CalendarPlus>
								<span className='text ml_6'>
									{t('translation:todo.Header.options.sort.create_at')}
								</span>
							</div>
						)
					}
				]
			}
		],
		[i18n.language]
	)

	return (
		<div className={$cx('limited_content_wrap border_box flex justify_between align_center', styles._local)}>
			<div className='left_wrap flex flex_column'>
				<div className='flex align_center'>
					<When condition={icon}>
						<Emoji
							className='mr_8 icon_emoji'
							shortcodes={icon}
							size={21}
							hue={icon_hue}
						></Emoji>
					</When>
					<div className='name flex justify_between align_center'>{name}</div>
				</div>
				<When condition={desc}>
					<span className='desc'>{desc}</span>
				</When>
			</div>
			<div className='actions_wrap flex align_center'>
				<Dropdown
					destroyPopupOnHide
					trigger={['click']}
					overlayStyle={{ width: 111 }}
					menu={{ items: related_menu }}
				>
					<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable mr_8'>
						<Files size={18}></Files>
					</div>
				</Dropdown>
				<Tooltip title={t('translation:todo.Header.archive')} placement='top'>
					<div
						className='icon_wrap border_box flex justify_center align_center cursor_point clickable mr_8'
						onClick={showArchiveModal}
					>
						<ArchiveBox size={18}></ArchiveBox>
					</div>
				</Tooltip>
				<ConfigProvider getPopupContainer={() => document.body}>
					<Dropdown
						destroyPopupOnHide
						trigger={['click']}
						overlayStyle={{ width: 90 }}
						menu={{ items: options_menu }}
					>
						<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable'>
							<DotsThreeCircleVertical size={19}></DotsThreeCircleVertical>
						</div>
					</Dropdown>
				</ConfigProvider>
			</div>
		</div>
	)
}

export default $app.memo(Index)
