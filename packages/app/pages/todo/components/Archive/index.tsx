import { Drawer, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { SimpleEmpty } from '@/components'

import { useScrollToBottom } from './hooks'
import styles from './index.css'
import Item from './Item'

import type { IPropsArchive } from '../../types'

const Index = (props: IPropsArchive) => {
	const {
		visible_archive_modal,
		archives,
		archive_counts,
		end,
		restoreArchiveItem,
		removeArchiveItem,
		loadMore,
		onClose
	} = props
	const { t } = useTranslation()
	const { setRef } = useScrollToBottom(loadMore, visible_archive_modal)

	const Actions = (
		<div className='footer_wrap w_100 h_100 flex justify_between align_center'>
			<div className='flex align_center'>
				<div className='label'>清档：</div>
				<Select
					className='select'
					placeholder='选择日期'
					bordered={false}
					suffixIcon={false}
					size='small'
					options={[
						{ value: '3days' },
						{ value: '1week' },
						{ value: '15days' },
						{ value: '1month' },
						{ value: '3month' },
						{ value: '6month' },
						{ value: '1year' }
					]}
				></Select>
			</div>
			<span className='counts'>共{archive_counts}条记录</span>
		</div>
	)

	return (
		<Drawer
			rootClassName={$cx('hide_mask', styles._local)}
			open={visible_archive_modal}
			title={t('translation:todo.Archive.title')}
			width={300}
			destroyOnClose
			getContainer={document.body}
			onClose={onClose}
			footer={Actions}
		>
			{archives.length > 0 && (
				<div className='archive_items w_100 border_box flex flex_column'>
					{archives.map((item) => (
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
