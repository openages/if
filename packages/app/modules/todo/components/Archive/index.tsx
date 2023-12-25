import { useMemoizedFn } from 'ahooks'
import { DatePicker, Drawer, Form, Popover, Radio, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { SimpleEmpty } from '@/components'
import { getExsitValues } from '@/utils'
import { ArrowCounterClockwise, Funnel } from '@phosphor-icons/react'

import Item from './Item'
import { useScrollToBottom } from './hooks'
import styles from './index.css'

import type { IPropsArchive } from '../../types'

const { Item: FormItem } = Form
const { Group } = Radio

const Index = (props: IPropsArchive) => {
	const {
		visible_archive_modal,
		archives,
		archive_counts,
		end,
		angles,
		tags,
		archive_query_params,
		loadMore,
		onClose,
		restoreArchiveItem,
		removeArchiveItem,
		archiveByTime,
		setArchiveQueryParams
	} = props
	const { t } = useTranslation()
	const { setRef } = useScrollToBottom(loadMore, visible_archive_modal)

	const options_archive = useMemo(
		() => [
			{ label: t('translation:todo.Archive.clean.options.1week'), value: '1week' },
			{ label: t('translation:todo.Archive.clean.options.15days'), value: '15days' },
			{ label: t('translation:todo.Archive.clean.options.1month'), value: '1month' },
			{ label: t('translation:todo.Archive.clean.options.3month'), value: '3month' },
			{ label: t('translation:todo.Archive.clean.options.6month'), value: '6month' },
			{ label: t('translation:todo.Archive.clean.options.1year'), value: '1year' }
		],
		[]
	)

	const exsit_query_params = useMemo(
		() => Object.keys(getExsitValues(archive_query_params)).length > 0,
		[archive_query_params]
	)

	const onValuesChange = useMemoizedFn((_, values) => {
		setArchiveQueryParams(values)
	})

	const Filter = (
		<Form
			className='filter_wrap'
			layout='vertical'
			size='small'
			initialValues={archive_query_params}
			onValuesChange={onValuesChange}
		>
			<FormItem label={t('translation:todo.Archive.filter.angle')} name='angle_id'>
				<Select
					allowClear
					placeholder={
						t('translation:todo.Archive.filter.select') +
						t('translation:todo.Archive.filter.angle')
					}
					fieldNames={{ label: 'text', value: 'id' }}
					options={angles}
				></Select>
			</FormItem>
			<FormItem label={t('translation:todo.Archive.filter.tags')} name='tags'>
				<Select
					allowClear
					placeholder={
						t('translation:todo.Archive.filter.select') +
						t('translation:todo.Archive.filter.tags')
					}
					mode='tags'
					fieldNames={{ label: 'text', value: 'id' }}
					options={tags}
				></Select>
			</FormItem>
			<FormItem
				label={t('translation:todo.Archive.filter.begin') + t('translation:todo.Archive.filter.date')}
				name='begin_date'
			>
				<DatePicker
					className='w_100'
					showToday={false}
					inputReadOnly
					style={{ height: 32 }}
					disabledDate={v => v.valueOf() > new Date().valueOf()}
				></DatePicker>
			</FormItem>
			<FormItem
				label={t('translation:todo.Archive.filter.end') + t('translation:todo.Archive.filter.date')}
				name='end_date'
			>
				<DatePicker
					className='w_100'
					showToday={false}
					inputReadOnly
					style={{ height: 32 }}
					disabledDate={v => v.valueOf() > new Date().valueOf()}
				></DatePicker>
			</FormItem>
			<FormItem className='status_item' label={t('translation:todo.Archive.filter.status')} name='status'>
				<Group>
					<Radio value='checked'>{t('translation:todo.common.status.checked')}</Radio>
					<Radio value='closed'>{t('translation:todo.common.status.closed')}</Radio>
				</Group>
			</FormItem>
		</Form>
	)

	const Extra = (
		<div className='flex align_center'>
			<When condition={exsit_query_params}>
				<div
					className='btn_clear btn flex justify_center align_center clickable absolute'
					onClick={() => setArchiveQueryParams({})}
				>
					<ArrowCounterClockwise size={16} weight='bold'></ArrowCounterClockwise>
				</div>
			</When>
			<Popover
				rootClassName={styles.popover}
				destroyTooltipOnHide
				trigger='click'
				content={Filter}
				align={{ offset: [0, -6] }}
			>
				<div>
					<div className='btn_filter btn flex justify_center align_center clickable'>
						<Funnel
							className={$cx(exsit_query_params && 'color_main')}
							size={16}
							weight='bold'
						></Funnel>
					</div>
				</div>
			</Popover>
		</div>
	)

	const Actions = (
		<div className='footer_wrap w_100 h_100 flex justify_between align_center'>
			<div className='flex align_center'>
				<div className='label mr_2'>{t('translation:todo.Archive.clean.title')}</div>
				<Select
					className='select borderless'
					popupClassName='borderless'
					placeholder={t('translation:todo.Archive.clean.placeholder')}
					bordered={false}
					suffixIcon={false}
					popupMatchSelectWidth={false}
					size='small'
					options={options_archive}
					onSelect={archiveByTime}
				></Select>
			</div>
			<span className='counts'>
				{/* @ts-ignore   */}
				{t('translation:todo.Archive.clean.total', { counts: archive_counts })}
			</span>
		</div>
	)

	return (
		<Drawer
			rootClassName={styles._local}
			open={visible_archive_modal}
			title={t('translation:todo.Archive.title')}
			width={321}
			destroyOnClose
			getContainer={false}
			extra={Extra}
			footer={Actions}
			onClose={onClose}
		>
			{archives.length > 0 && (
				<div className='archive_items w_100 border_box flex flex_column'>
					<Drawer>{Filter}</Drawer>
					{archives.map(item => (
						<Item {...{ item, restoreArchiveItem, removeArchiveItem }} key={item.id}></Item>
					))}
				</div>
			)}
			<When condition={!archives.length && end}>
				<SimpleEmpty></SimpleEmpty>
			</When>
			<div className={$cx('end w_100 text_center', !archives.length && end && 'hidden')} ref={setRef}>
				{end && t('translation:todo.Archive.end')}
			</div>
		</Drawer>
	)
}

export default $app.memo(Index)
