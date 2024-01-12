import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

import { Eraser, Notepad, Trash } from '@phosphor-icons/react'

import styles from '../index.css'

interface IProps {
	showDetailModal: () => void
	remove: () => void
	clean: () => void
}

const Index = (props: IProps) => {
	const { showDetailModal, remove, clean } = props
	const { t } = useTranslation()

	const confirmClean = useMemoizedFn(() => {
		$modal.confirm({
			title: t('translation:common.notice'),
			content: t('translation:common.erase.confirm'),
			centered: true,
			onOk() {
				clean()
			}
		})
	})

	return (
		<div className={$cx('flex justify_center align_center', styles.RenderOptions)}>
			<Tooltip title={t('translation:todo.Detail.title')} getTooltipContainer={() => document.body}>
				<div>
					<div
						className='btn_action flex justify_center align_center cursor_point clickable mr_2'
						onClick={showDetailModal}
					>
						<Notepad size={14}></Notepad>
					</div>
				</div>
			</Tooltip>
			<Tooltip title={t('translation:todo.context_menu.remove')} getTooltipContainer={() => document.body}>
				<div>
					<div
						className='btn_action flex justify_center align_center cursor_point clickable mr_2'
						onClick={remove}
					>
						<Trash size={14}></Trash>
					</div>
				</div>
			</Tooltip>
			<Tooltip title={t('translation:common.erase.title')} getTooltipContainer={() => document.body}>
				<div>
					<div
						className='btn_action flex justify_center align_center cursor_point clickable'
						onClick={confirmClean}
					>
						<Eraser size={14}></Eraser>
					</div>
				</div>
			</Tooltip>
		</div>
	)
}

export default $app.memo(Index)
