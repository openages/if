import { Tooltip } from 'antd'

import { useLocale } from '@/hooks'
import { CirclesThreePlus, FolderMinus, ListPlus } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { setModalOpen, setFoldAll } = props
	const l = useLocale()

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			<div
				className='add_list_wrap h_100 border_box flex align_center transition_normal cursor_point'
				onClick={() => setModalOpen(true, 'file')}
			>
				<ListPlus size={16}></ListPlus>
				<span className='text ml_6'>{l('dirtree.add') + l('dirtree.file')}</span>
			</div>
			<Tooltip title={l('dirtree.add') + l('dirtree.dir')} placement='top'>
				<div
					className='add_group_wrap other_action h_100 border_box flex justify_center align_center transition_normal cursor_point'
					onClick={() => setModalOpen(true, 'dir')}
				>
					<CirclesThreePlus size={16}></CirclesThreePlus>
				</div>
			</Tooltip>
			<Tooltip title={l('dirtree.fold_all')} placement='top'>
				<div
					className='fold_wrap other_action h_100 border_box flex justify_center align_center transition_normal cursor_point'
					onClick={() => setFoldAll(true)}
				>
					<FolderMinus size={16}></FolderMinus>
				</div>
			</Tooltip>
		</div>
	)
}

export default $app.memo(Index)
