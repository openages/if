import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

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
		<div className='actions_wrap w_100 h_100 flex justify_between align_center'>
			<span className='counts'>共有{archive_counts}条记录</span>
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
			<div className='archive_items w_100 border_box flex flex_column'>
				{archives.map((item) => (
					<Item {...{ item, restoreArchiveItem, removeArchiveItem }} key={item.id}></Item>
				))}
			</div>
			<div className='end w_100 text_center' ref={setRef}>
				{end && t('translation:todo.Archive.end')}
			</div>
		</Drawer>
	)
}

export default $app.memo(Index)
