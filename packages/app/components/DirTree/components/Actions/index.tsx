import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

import { CirclesThreePlus, ListPlus } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { setModalOpen } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('actions_wrap w_100 border_box flex', styles._local)}>
			<div
				className='add_list_wrap h_100 border_box flex align_center transition_normal cursor_point'
				onClick={() => setModalOpen(true, 'file')}
			>
				<ListPlus size={16}></ListPlus>
				<span className='text ml_6'>{t('dirtree.add') + t('dirtree.file')}</span>
			</div>
			<Tooltip
				title={t('dirtree.add') + t('dirtree.dir')}
				placement='top'
				zIndex={100000}
				getPopupContainer={() => document.body}
			>
				<div
					className='add_group_wrap other_action h_100 border_box flex justify_center align_center transition_normal cursor_point'
					onClick={() => setModalOpen(true, 'dir')}
				>
					<CirclesThreePlus size={16}></CirclesThreePlus>
				</div>
			</Tooltip>
		</div>
	)
}

export default $app.memo(Index)
