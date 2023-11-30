import { useMemoizedFn } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch, Case } from 'react-if'

import { getRelativeTime } from '@/utils'
import { Square, CheckSquare, ArrowCounterClockwise, Trash, HourglassMedium } from '@phosphor-icons/react'

import CycleStatus from '../CycleStatus'

import type { IPropsArchiveItem } from '../../types'
import type { Todo } from '@/types'

const Index = (props: IPropsArchiveItem) => {
	const { item, restoreArchiveItem, removeArchiveItem } = props
	const { id, text, status, cycle_enabled, cycle, recycle_time, create_at } = item
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)

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

	const data_children = useMemo(() => {
		if (!item.children?.length) return

		const checked_children = item.children.filter((item) => item.status === 'checked')

		return `${checked_children.length}/${item.children.length}`
	}, [item.children])

	const getTextItem = useMemoizedFn((id: string, status: Todo.Todo['status'], text, is_parent: boolean) => {
		const icon_size = is_parent ? 16 : 14
		const recycle = is_parent && cycle_enabled && cycle && recycle_time

		return (
			<div className={$cx('text_wrap w_100 relative', is_parent ? 'parent' : 'child')} key={id}>
				<div className='status_wrap flex justify_center align_center absolute'>
					<Switch>
						<Case condition={status === 'unchecked' || status === 'closed'}>
							<Square size={icon_size} />
						</Case>
						<Case condition={status === 'checked'}>
							<CheckSquare size={icon_size} />
						</Case>
					</Switch>
				</div>
				{recycle && (
					<div className='recycle_wrap flex justify_center align_center absolute'>
						{recycle_time && (
							<CycleStatus cycle={cycle} recycle_time={recycle_time}></CycleStatus>
						)}
						<HourglassMedium
							className='icon'
							size={recycle_time ? 8 : 10}
							weight={recycle_time ? 'bold' : 'fill'}
						></HourglassMedium>
					</div>
				)}
				<span
					className={$cx(
						'text cursor_point block',
						is_parent && data_children && 'has_children',
						recycle && 'recycle'
					)}
					data-children={is_parent ? data_children : ''}
					onClick={is_parent ? () => setOpen(!open) : undefined}
				>
					{text}
				</span>
			</div>
		)
	})

	return (
		<div className='archive_item w_100 border_box flex flex_column'>
			{getTextItem(id, status, text, true)}
			<AnimatePresence>
				{item.children?.length > 0 && open && (
					<motion.div
						className='children_wrap w_100 border_box flex flex_column relative'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						{item.children.map((it) => getTextItem(it.id, it.status, it.text, false))}
					</motion.div>
				)}
			</AnimatePresence>
			<div className='bottom_wrap flex justify_between align_center mt_4'>
				<span className='create_at'>{relative_time}</span>
				<div className='actions_wrap flex align_center'>
					<div
						className='btn_action flex align_center cursor_point clickable mr_4'
						onClick={restore}
					>
						<ArrowCounterClockwise size={12}></ArrowCounterClockwise>
						<span className='btn_text ml_2'>{t('translation:todo.Archive.restore')}</span>
					</div>
					<div className='btn_action flex align_center cursor_point clickable' onClick={remove}>
						<Trash size={12}></Trash>
						<span className='btn_text ml_2'>{t('translation:todo.Archive.remove')}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
