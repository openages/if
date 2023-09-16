import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getRelativeTime } from '@/utils'
import { ArrowCounterClockwise, Trash } from '@phosphor-icons/react'

import type { IPropsArchiveItem } from '../../types'

const Index = (props: IPropsArchiveItem) => {
	const { item, restoreArchiveItem, removeArchiveItem } = props
	const { id, text, status, create_at } = item
	const { t } = useTranslation()

	const relative_time = useMemo(() => {
		const time = getRelativeTime(create_at)

		// @ts-ignore
		if (!time.unit) return t(`translation:common.time.${time.x}`)

		// @ts-ignore
		return t(`translation:common.time.x_unit_ago`, {
			x: time.x,
			// @ts-ignore
			unit: t(`translation:common.time.${time.unit}`)
		})
	}, [create_at])

	const restore = useMemoizedFn(() => restoreArchiveItem(id))
	const remove = useMemoizedFn(() => removeArchiveItem(id))

	return (
		<div className={$cx('archive_item w_100 border_box flex flex_column', status)}>
			<span className='text w_100'>{text}</span>
			<div className='flex justify_between align_center mt_4'>
				<span className='create_at'>{relative_time}</span>
				<div className='action_wrap align_center'>
					<div
						className='btn_action flex align_center cursor_point clickable mr_4'
						onClick={restore}
					>
						<ArrowCounterClockwise size={14}></ArrowCounterClockwise>
						<span className='btn_text ml_2'>{t('translation:todo.Archive.restore')}</span>
					</div>
					<div className='btn_action flex align_center cursor_point clickable' onClick={remove}>
						<Trash size={14}></Trash>
						<span className='btn_text ml_2'>{t('translation:todo.Archive.remove')}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
