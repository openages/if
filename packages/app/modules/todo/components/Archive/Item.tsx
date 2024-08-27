import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useText, useTextChange, Text } from '@/Editor'
import { ArrowCounterClockwise, CheckSquare, Square, Trash } from '@phosphor-icons/react'

import CycleStatus from '../CycleStatus'

import type { Todo } from '@/types'
import type { IPropsArchiveItem } from '../../types'

interface IPropsTextItem {
	id: string
	status: Todo.Todo['status']
	text: string
	is_parent?: boolean
	open?: boolean
	data_children?: string
	setOpen?: (v: boolean) => void
}

const TextItem = $app.memo((props: IPropsTextItem) => {
	const { id, status, text, is_parent, open, data_children, setOpen } = props
	const icon_size = is_parent ? 16 : 14

	const { ref_editor, ref_input, onChange, setEditor, setRef } = useText({ text })

	useLayoutEffect(() => {
		const el = ref_input.current

		if (!el) return

		if (!data_children) {
			el.removeAttribute('data-children')

			return
		}

		el.setAttribute('data-children', data_children)
	}, [data_children])

	useTextChange({ ref_editor, text })

	return (
		<div className={$cx('text_wrap w_100 relative', is_parent ? 'parent' : 'child')} key={id}>
			<div className='status_wrap flex justify_center align_center absolute'>
				<Choose>
					<When condition={status === 'unchecked' || status === 'closed'}>
						<Square size={icon_size} />
					</When>
					<Otherwise>
						<CheckSquare size={icon_size} />
					</Otherwise>
				</Choose>
			</div>
			<Text
				className={$cx('text block', is_parent && data_children && 'has_children')}
				readonly
				onChange={onChange}
				setEditor={setEditor}
				setRef={setRef}
				onClick={is_parent && setOpen ? () => setOpen(!open) : undefined}
			></Text>
		</div>
	)
})

const Index = (props: IPropsArchiveItem) => {
	const { item, restoreArchiveItem, removeArchiveItem } = props
	const { id, text, status, cycle_enabled, cycle, recycle_time, create_at } = item
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)

	const relative_time = useMemo(() => dayjs().to(create_at), [create_at])
	const recycle = cycle_enabled && cycle && recycle_time

	const restore = useMemoizedFn(() => restoreArchiveItem(id))
	const remove = useMemoizedFn(() => removeArchiveItem(id))

	const data_children = useMemo(() => {
		if (!item.children?.length) return

		const checked_children = item.children.filter(item => item?.status === 'checked')

		return `${checked_children.length}/${item.children.length}`
	}, [item.children])

	return (
		<div className='archive_item w_100 border_box flex flex_column'>
			<TextItem {...{ id, status, text, open, data_children, setOpen }} is_parent></TextItem>
			<AnimatePresence>
				{item.children?.length! > 0 && open && (
					<motion.div
						className='children_wrap w_100 border_box flex flex_column relative'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
						layout
					>
						{item.children!.map(it => (
							<TextItem id={it.id} status={it.status} text={it.text} key={it.id}></TextItem>
						))}
					</motion.div>
				)}
			</AnimatePresence>
			<div className='bottom_wrap flex justify_between align_center'>
				<div className='create_at flex align_center'>
					{relative_time}
					{recycle && <CycleStatus cycle={cycle} recycle_time={recycle_time}></CycleStatus>}
				</div>
				<div className='actions_wrap flex align_center'>
					<div className='btn_action flex align_center cursor_point clickable' onClick={restore}>
						<ArrowCounterClockwise size={12}></ArrowCounterClockwise>
						<span className='btn_text ml_2'>{t('todo.Archive.restore')}</span>
					</div>
					<div className='btn_action flex align_center cursor_point clickable' onClick={remove}>
						<Trash size={12}></Trash>
						<span className='btn_text ml_2'>{t('todo.Archive.remove')}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
