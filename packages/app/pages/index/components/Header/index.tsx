import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { PencilSimple, Files, ArchiveBox } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const { name, icon, desc, showSettingsModal } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('limited_content_wrap border_box flex justify_between align_center', styles._local)}>
			<div className='left_wrap flex flex_column'>
				<div className='flex align_center'>
					<When condition={icon}>
						<em-emoji className='mr_8 icon_emoji' shortcodes={icon} size='21px'></em-emoji>
					</When>
					<div className='name flex justify_between align_center'>{name}</div>
				</div>
				<When condition={desc}>
					<span className='desc'>{desc}</span>
				</When>
			</div>
			<div className='actions_wrap flex align_center'>
				<Tooltip title={t('translation:todo.Header.edit')} placement='bottom'>
					<div
						className='icon_wrap border_box flex justify_center align_center cursor_point clickable mr_8'
						onClick={showSettingsModal}
					>
						<PencilSimple size={18}></PencilSimple>
					</div>
				</Tooltip>
				<Tooltip title={t('translation:todo.Header.reference')} placement='bottom'>
					<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable mr_8'>
						<Files size={18}></Files>
					</div>
				</Tooltip>
				<Tooltip title={t('translation:todo.Header.archive')} placement='bottom'>
					<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable'>
						<ArchiveBox size={18}></ArchiveBox>
					</div>
				</Tooltip>
			</div>
		</div>
	)
}

export default $app.memo(Index)
