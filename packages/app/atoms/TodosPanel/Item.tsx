import { useMemoizedFn } from 'ahooks'
import { Dropdown } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useText, useTextChange, Text } from '@/Editor'
import { CheckCircle, Circle, ListMagnifyingGlass, Trash } from '@phosphor-icons/react'

import ChildrenItem from './ChildrenItem'
import styles from './index.css'

import type { Todo } from '@/types'
import type Model from './model'
import type { MenuProps } from 'antd'

interface IProps {
	item: Todo.Todo
	index: number
	updateTodoItem: Model['updateTodoItem']
	changeStatus: Model['changeStatus']
	check: Model['check']
	remove: Model['remove']
}

const Index = (props: IProps) => {
	const { item, index, updateTodoItem, changeStatus, check, remove } = props
	const { id, text, status, children } = item
	const { t, i18n } = useTranslation()
	const [open, setOpen] = useState(false)

	const { ref_editor, onChange, setEditor, setRef } = useText({ text })

	useTextChange({ ref_editor, text })

	const toggleChildren = useMemoizedFn(() => setOpen(!open))

	const children_status = useMemo(() => {
		if (!(children?.length! > 0)) return ''

		const checked_children = children!.filter(item => item?.status === 'checked')

		return `${checked_children.length}/${children!.length}`
	}, [children])

	const context_menu_items = useMemo(
		() =>
			[
				{
					key: 'check',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<ListMagnifyingGlass size={14}></ListMagnifyingGlass>
							<span className='text ml_6'>{t('common.check')}</span>
						</div>
					)
				},
				{
					key: 'remove',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Trash size={14}></Trash>
							<span className='text ml_6'>{t('common.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language]
	)

	const onChangeStatus = useMemoizedFn(() => {
		if (status === 'closed') return

		changeStatus(index, id, status === 'unchecked' ? 'checked' : 'unchecked')
	})

	const updateChildStatus = useMemoizedFn(
		(child_index: number, status: Required<Todo.Todo>['children'][number]['status']) => {
			const target_children = $copy(children)!

			target_children[child_index].status = status

			updateTodoItem(index, id, { children: target_children })
		}
	)

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'check':
				check(index)
				break
			case 'remove':
				remove(index)
				break
		}
	})

	return (
		<div
			className={$cx(
				'w_100 flex flex_column',
				styles.Item,
				(status === 'checked' || status === 'closed') && styles.done
			)}
		>
			<div className='w_100 border_box flex'>
				<div
					className='action_wrap flex justify_center align_center cursor_point clickable'
					onClick={onChangeStatus}
				>
					<Choose>
						<When condition={status === 'unchecked' || status === 'closed'}>
							<Circle />
						</When>
						<When condition={status === 'checked'}>
							<CheckCircle />
						</When>
					</Choose>
				</div>
				<Dropdown
					destroyPopupOnHide
					trigger={['contextMenu']}
					overlayStyle={{ width: 90 }}
					menu={{
						items: context_menu_items,
						onClick: onContextMenu
					}}
				>
					<span
						className={$cx(
							'todo_text cursor_point',
							!open && children?.length! > 0 && 'has_children'
						)}
						data-children={children_status}
						onClick={children && children.length ? toggleChildren : undefined}
					>
						<Text readonly onChange={onChange} setEditor={setEditor} setRef={setRef}></Text>
					</span>
				</Dropdown>
			</div>
			<AnimatePresence>
				{open && children && (
					<motion.div
						className={'children_wrap w_100 border_box'}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						<div className='children_wrap w_100 border_box flex flex_column'>
							{children.map((child, child_index) => (
								<ChildrenItem
									item={child}
									index={child_index}
									updateChildStatus={updateChildStatus}
									key={child_index}
								></ChildrenItem>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default $app.memo(Index)
