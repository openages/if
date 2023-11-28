import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch, Case } from 'react-if'

import { getRelativeTime } from '@/utils'
import { Square, CheckSquare, ArrowCounterClockwise, Trash } from '@phosphor-icons/react'

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
			<div className='text_wrap w_100 relative'>
				<div className='action_wrap flex justify_center align_center cursor_point clickable'>
					<Switch>
						<Case condition={status === 'unchecked'}>
							<Square size={14} />
						</Case>
						<Case condition={status === 'checked'}>
							<CheckSquare size={14} />
						</Case>
					</Switch>
				</div>
				<span className='text'>{text}</span>
			</div>
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
