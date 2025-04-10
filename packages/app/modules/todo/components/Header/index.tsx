import { useMemoizedFn } from 'ahooks'
import { Input, Popover, Select, Switch, Tooltip } from 'antd'
import { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Crown, Emoji } from '@/components'
import { useText, useTextChange, Text } from '@/Editor'
import {
	AlignLeft,
	ArchiveBox,
	CalendarDots,
	CaretDown,
	CaretUp,
	ChartBar,
	DotsThreeCircleVertical,
	Faders,
	FileXls,
	Funnel,
	GitFork,
	GridFour,
	Kanban,
	ListChecks,
	MagnifyingGlass,
	SlidersHorizontal,
	Table,
	X
} from '@phosphor-icons/react'

import TagSelect from '../TagSelect'
import { TableFields } from './components'
import styles from './index.css'

import type { IPropsHeader } from '../../types'
import type { FocusEvent, MouseEvent } from 'react'
import type { ItemsSortType } from '@/modules/todo/types/model'

const Index = (props: IPropsHeader) => {
	const {
		mode,
		zen_mode,
		name,
		icon,
		icon_hue,
		desc,
		tags,
		items_sort_param,
		items_filter_tags,
		search_mode,
		table_exclude_fields,
		setMode,
		toggleZenMode,
		showSettingsModal,
		showArchiveModal,
		showAnalysisModal,
		showActivityModal,
		setItemsSortParam,
		setItemsFilterTags,
		toggleTableFilter,
		resetSearchMode,
		updateSetting,
		exportToExcel
	} = props

	const { t } = useTranslation()

	const [open_panel, setOpenPanel] = useState(false)
	const [open_table_fields, setOpenTableFields] = useState(false)

	const { ref_editor, onChange, setEditor, setRef } = useText({
		text: desc!,
		update: v => updateSetting({ desc: v })
	})

	const { editor_size } = useTextChange({ ref_editor, text: desc! })

	const onChangeName = useMemoizedFn((e: FocusEvent<HTMLInputElement, Element>) => {
		const v = e.target.value

		if (!v) return

		updateSetting({ name: v })
	})

	const toggleSortOrder = useMemoizedFn(() => {
		setItemsSortParam({ ...items_sort_param!, order: items_sort_param!.order === 'asc' ? 'desc' : 'asc' })
	})

	const resetSortParam = useMemoizedFn(() => {
		setItemsSortParam(null!)
	})

	const onChangeMode = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		let target = e.target as HTMLDivElement

		while (!target?.classList?.contains('mode_item_wrap')) {
			if (!target?.parentElement) break

			target = target.parentElement as HTMLDivElement
		}

		const key = target?.getAttribute('data-key') as IPropsHeader['mode']

		if (!key) return

		setOpenPanel(false)
		setMode(key)
	})

	const onSelectSort = useMemoizedFn(key => {
		switch (key) {
			case 'importance':
				setItemsSortParam({ type: 'importance', order: 'desc' })
				break
			case 'alphabetical':
				setItemsSortParam({ type: 'alphabetical', order: 'asc' })
				break
			case 'create_at':
				setItemsSortParam({ type: 'create_at', order: 'desc' })
		}
	})

	const showAnalysis = useMemoizedFn(() => {
		showAnalysisModal()
		setOpenPanel(false)
	})

	const showActivity = useMemoizedFn(() => {
		showActivityModal()
		setOpenPanel(false)
	})

	const Setting = (
		<div className={$cx('flex flex_column w_100 border_box', styles.setting_wrap)}>
			<div className='mode_wrap w_100 border_box flex flex_wrap' onClick={onChangeMode}>
				<div
					className={$cx(
						'mode_item_wrap border_box flex flex_column align_center clickable',
						mode === 'list' && 'active'
					)}
					data-key='list'
				>
					<ListChecks className='icon'></ListChecks>
					<span className='text'>{t('todo.Header.mode.list')}</span>
				</div>
				<div
					className={$cx(
						'mode_item_wrap border_box flex flex_column align_center clickable',
						mode === 'kanban' && 'active'
					)}
					data-key='kanban'
				>
					<Kanban className='icon'></Kanban>
					<span className='text'>{t('todo.Header.mode.kanban')}</span>
				</div>
				<div
					className={$cx(
						'mode_item_wrap border_box flex flex_column align_center clickable',
						mode === 'table' && 'active'
					)}
					data-key='table'
				>
					<Table className='icon'></Table>
					<span className='text'>{t('todo.Header.mode.table')}</span>
				</div>
				<div
					className={$cx(
						'mode_item_wrap border_box flex flex_column align_center clickable relative',
						mode === 'flat' && 'active'
					)}
					data-key='flat'
				>
					<Crown type='card'></Crown>
					<AlignLeft className='icon'></AlignLeft>
					<span className='text'>{t('todo.Header.mode.flat')}</span>
				</div>
				<div
					className={$cx(
						'mode_item_wrap border_box flex flex_column align_center clickable relative',
						mode === 'quad' && 'active'
					)}
					data-key='quad'
				>
					<Crown type='card'></Crown>
					<GridFour className='icon'></GridFour>
					<span className='text'>{t('todo.Header.mode.quad')}</span>
				</div>
				<div
					className={$cx(
						'mode_item_wrap border_box flex flex_column align_center clickable relative',
						mode === 'mindmap' && 'active'
					)}
					data-key='mindmap'
				>
					<Crown type='card'></Crown>
					<GitFork className='icon'></GitFork>
					<span className='text'>{t('todo.Header.mode.mindmap')}</span>
				</div>
			</div>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item flex justify_between align_center' onClick={toggleZenMode}>
					<span className='label'>{t('todo.Header.zen')}</span>
					<Switch checked={zen_mode} size='small'></Switch>
				</div>
				<div className='setting_item flex justify_between align_center'>
					<span className='label'>{t('todo.Header.options.sort.text')}</span>
					<Select
						className='select_sort'
						variant='borderless'
						popupClassName='borderless'
						disabled={mode === 'mindmap' || mode === 'table'}
						options={[
							{
								value: 'importance',
								label: t('todo.Header.options.sort.importance')
							},
							{
								value: 'alphabetical',
								label: t('todo.Header.options.sort.alphabetical')
							},
							{
								value: 'create_at',
								label: t('todo.Header.options.sort.create_at')
							}
						]}
						value={items_sort_param?.type}
						onChange={onSelectSort}
					></Select>
				</div>
				<div className='setting_item flex justify_between align_center'>
					<span className='label'>{t('todo.Header.options.tags')}</span>
					<TagSelect
						className='select_tags'
						placement='bottomRight'
						unlimit
						show_suffix
						options={tags}
						value={items_filter_tags}
						onChange={v => setItemsFilterTags(v)}
					></TagSelect>
				</div>
			</div>
			<div className='options_wrap w_100 border_box flex flex_column'>
				<div
					className='option_wrap flex justify_between align_center cursor_point'
					onClick={showAnalysis}
				>
					<div className='flex align_center'>
						<ChartBar className='mr_6' size={14}></ChartBar>
						<span className='label'>{t('todo.Header.options.analysis')}</span>
					</div>
					<Crown type='element'></Crown>
				</div>
				<div
					className='option_wrap flex justify_between align_center cursor_point'
					onClick={showActivity}
				>
					<div className='flex align_center'>
						<CalendarDots className='mr_6' size={14}></CalendarDots>
						<span className='label'>{t('atoms.TodoActivity.title')}</span>
					</div>
					<Crown type='element'></Crown>
				</div>
			</div>
		</div>
	)

	return (
		<div
			className={$cx(
				'limited_content_wrap border_box flex justify_between align_center relative',
				styles._local,
				mode !== 'list' && styles.not_list,
				(mode === 'kanban' ||
					mode === 'quad' ||
					mode === 'flat' ||
					mode === 'table' ||
					mode === 'mindmap') &&
					styles.mini,
				styles[mode],
				editor_size && styles.desc
			)}
		>
			<div className='left_wrap flex flex_column'>
				<div className='flex align_center'>
					<If condition={!!icon}>
						<Emoji
							className='icon_emoji'
							shortcodes={icon!}
							size={
								mode === 'kanban' ||
								mode === 'quad' ||
								mode === 'flat' ||
								mode === 'mindmap'
									? 15
									: 21
							}
							hue={icon_hue}
						></Emoji>
					</If>
					<Input
						className='name flex justify_between align_center'
						maxLength={72}
						defaultValue={name}
						onBlur={onChangeName}
					></Input>
				</div>
				<Text
					className={$cx('desc', (mode !== 'list' || !editor_size) && 'none')}
					max_length={150}
					onChange={onChange}
					setEditor={setEditor}
					setRef={setRef}
				></Text>
			</div>
			<div className='actions_wrap flex justify_end align_center'>
				{(items_filter_tags.length > 0 || items_sort_param) && (
					<div className='filter_wrap flex align_center'>
						{items_filter_tags.length > 0 && (
							<TagSelect
								className='select_tags on_header'
								placement='bottomRight'
								unlimit
								useByInput
								options={tags}
								value={items_filter_tags}
								onChange={v => setItemsFilterTags(v)}
							></TagSelect>
						)}
						{items_sort_param && (
							<div className='filter_item border_box flex align_center'>
								<div
									className='type_wrap flex align_center clickable'
									onClick={toggleSortOrder}
								>
									<span className='text'>
										{t(
											`todo.Header.options.sort.${items_sort_param.type as ItemsSortType}`
										)}
									</span>
									<span className='btn_order ml_2 flex justify_center align_center'>
										<Choose>
											<When condition={items_sort_param.order === 'desc'}>
												<CaretUp size={12} weight='bold'></CaretUp>
											</When>
											<Otherwise>
												<CaretDown size={12} weight='bold'></CaretDown>
											</Otherwise>
										</Choose>
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
				{search_mode && (
					<div className='mr_8'>
						<div
							className='icon_wrap color_main border_box flex justify_center align_center cursor_point clickable'
							onClick={resetSearchMode}
						>
							<MagnifyingGlass></MagnifyingGlass>
						</div>
					</div>
				)}
				{mode === 'table' && (
					<Fragment>
						<Tooltip title={t('todo.Header.table_mode.export_xls')}>
							<div className='mr_8'>
								<div
									className='icon_wrap border_box flex justify_center align_center cursor_point clickable'
									onClick={exportToExcel}
								>
									<FileXls></FileXls>
								</div>
							</div>
						</Tooltip>
						<Popover
							trigger={['click']}
							placement='bottom'
							destroyTooltipOnHide
							content={
								<TableFields
									table_exclude_fields={table_exclude_fields}
									updateSetting={updateSetting}
								/>
							}
							open={open_table_fields}
							onOpenChange={setOpenTableFields}
						>
							<div>
								<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable mr_8'>
									<SlidersHorizontal></SlidersHorizontal>
								</div>
							</div>
						</Popover>
						<Tooltip title={t('todo.Header.table_mode.filter')}>
							<div className='mr_8'>
								<div
									className='icon_wrap border_box flex justify_center align_center cursor_point clickable'
									onClick={toggleTableFilter}
								>
									<Funnel></Funnel>
								</div>
							</div>
						</Tooltip>
					</Fragment>
				)}
				<Popover
					trigger={['click']}
					placement='bottom'
					destroyTooltipOnHide
					content={Setting}
					open={open_panel}
					onOpenChange={setOpenPanel}
				>
					<div>
						<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable'>
							<Faders></Faders>
						</div>
					</div>
				</Popover>
				<div
					className='icon_wrap border_box flex justify_center align_center cursor_point clickable ml_8'
					onClick={showArchiveModal}
				>
					<ArchiveBox></ArchiveBox>
				</div>
				<div
					className='icon_wrap border_box flex justify_center align_center cursor_point clickable ml_8'
					onClick={showSettingsModal}
				>
					<DotsThreeCircleVertical></DotsThreeCircleVertical>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
