import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { If, Then, Else } from 'react-if'

import { getRelativeTime } from '@/utils'
import { Check, X, ArrowCounterClockwise, Trash } from '@phosphor-icons/react'

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
		<div className='archive_item w_100 border_box flex flex_column'>
			<span className='text w_100'>{text}</span>
			<div className='footer_wrap flex justify_between align_center mt_2'>
				<div className='flex align_center'>
					<div className={$cx('status_wrap flex justify_center align_center', status)}>
						<If condition={status === 'checked'}>
							<Then>
								<Check size={12} />
							</Then>
							<Else>
								<X size={12} />
							</Else>
						</If>
					</div>
					<span className='create_at ml_4'>{relative_time}</span>
				</div>
				<div className='action_wrap align_center' onClick={restore}>
					<div className='btn_action flex align_center cursor_point clickable' onClick={restore}>
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
