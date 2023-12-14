import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Else, If, Then, When } from 'react-if'

import { Emoji } from '@/components'
import { ArchiveBox, CaretDown, CaretUp, DotsThreeCircleVertical, Files, X } from '@phosphor-icons/react'

import TagSelect from '../TagSelect'
import { useContextMenu } from './hooks'
import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const {
		name,
		icon,
		icon_hue,
		desc,
		tags,
		items_sort_param,
		items_filter_tags,
		showSettingsModal,
		showArchiveModal,
		showHelpModal,
		setItemsSortParam,
		setItemsFilterTags
	} = props
	const { t } = useTranslation()
	const { related_menu, options_menu, onContextMenu } = useContextMenu({
		tags,
		items_filter_tags,
		showSettingsModal,
		showHelpModal,
		setItemsSortParam,
		setItemsFilterTags
	})

	const toggleSortOrder = useMemoizedFn(() => {
		setItemsSortParam({ ...items_sort_param, order: items_sort_param.order === 'asc' ? 'desc' : 'asc' })
	})

	const resetSortParam = useMemoizedFn(() => {
		setItemsSortParam(null)
	})

	const resetFilterTags = useMemoizedFn(() => {
		setItemsFilterTags([])
	})

	return (
		<div
			className={$cx(
				'limited_content_wrap border_box flex flex_wrap justify_between align_center relative',
				styles._local
			)}
		>
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
			{(items_filter_tags.length > 0 || items_sort_param) && (
				<div className='filter_wrap flex absolute top_0'>
					{items_filter_tags.length > 0 && (
						<div className='filter_item filter_tags border_box flex align_center'>
							<TagSelect
								className='select_tags'
								options={tags}
								value={items_filter_tags}
								placement='bottomRight'
								onChange={v => setItemsFilterTags(v)}
							></TagSelect>
							<span
								className='btn_remove btn flex justify_center align_center clickable'
								onClick={resetFilterTags}
							>
								<X size={12} weight='bold'></X>
							</span>
						</div>
					)}
					{items_sort_param && (
						<div className='filter_item border_box flex align_center ml_4'>
							<div
								className='type_wrap flex align_center clickable'
								onClick={toggleSortOrder}
							>
								<span className='text'>
									{t(
										`translation:todo.Header.options.sort.${items_sort_param.type}`
									)}
								</span>
								<span className='btn_order ml_2 flex justify_center align_center'>
									<If condition={items_sort_param.order === 'desc'}>
										<Then>
											<CaretUp size={12} weight='bold'></CaretUp>
										</Then>
										<Else>
											<CaretDown size={12} weight='bold'></CaretDown>
										</Else>
									</If>
								</span>
							</div>
							<span
								className='btn_remove flex justify_center align_center clickable'
								onClick={resetSortParam}
							>
								<X size={12} weight='bold'></X>
							</span>
						</div>
					)}
				</div>
			)}
			<div className='actions_wrap flex align_center'>
				<Dropdown
					destroyPopupOnHide
					trigger={['click']}
					overlayStyle={{ width: 111 }}
					menu={{ items: related_menu }}
				>
					<div>
						<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable mr_8'>
							<Files size={18}></Files>
						</div>
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
						menu={{ items: options_menu, onClick: onContextMenu }}
					>
						<div>
							<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable'>
								<DotsThreeCircleVertical size={19}></DotsThreeCircleVertical>
							</div>
						</div>
					</Dropdown>
				</ConfigProvider>
			</div>
		</div>
	)
}

export default $app.memo(Index)
