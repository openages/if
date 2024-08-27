import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

import { Eraser, Notepad, Trash } from '@phosphor-icons/react'

import styles from '../index.css'

import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent) => {
	const { row_index, deps, onAction } = props
	const { t } = useTranslation()

	const confirmClean = useMemoizedFn(() => {
		$modal.confirm({
			title: t('common.notice'),
			content: t('common.erase.confirm'),
			centered: true,
			onOk() {
				onAction!('clean', deps, row_index)
			}
		})
	})

	const onDetail = useMemoizedFn(() => onAction!('detail', deps, row_index))
	const onRemove = useMemoizedFn(() => onAction!('remove', deps, row_index))

	return (
		<div className={$cx('flex justify_center align_center', styles.RenderOptions)}>
			<Tooltip title={t('todo.Detail.title')} getTooltipContainer={() => document.body}>
				<div>
					<div
						className='btn_action flex justify_center align_center cursor_point clickable mr_2'
						onClick={onDetail}
					>
						<Notepad size={14}></Notepad>
					</div>
				</div>
			</Tooltip>
			<Tooltip title={t('todo.context_menu.remove')} getTooltipContainer={() => document.body}>
				<div>
					<div
						className='btn_action flex justify_center align_center cursor_point clickable mr_2'
						onClick={onRemove}
					>
						<Trash size={14}></Trash>
					</div>
				</div>
			</Tooltip>
			<Tooltip title={t('common.erase.title')} getTooltipContainer={() => document.body}>
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
