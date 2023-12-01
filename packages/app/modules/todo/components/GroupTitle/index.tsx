import { useMemoizedFn } from 'ahooks'
import { Dropdown, ConfigProvider } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical, Trash } from '@phosphor-icons/react'

import { useInput } from '../../hooks'
import styles from './index.css'

import type { IPropsGroupTitle } from '../../types'
import type { MenuProps } from 'antd'

const Index = (props: IPropsGroupTitle) => {
	const { item, index, update, remove } = props
	const { id } = item
	const { t, i18n } = useTranslation()
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id,
		data: { index }
	})
	const { input, onInput } = useInput({
		item,
		update: useMemoizedFn(textContent => update({ type: 'parent', index, value: { text: textContent } }))
	})

	const ContextMenu = useMemo(
		() =>
			[
				{
					key: 'remove',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Trash size={16}></Trash>
							<span className='text ml_6'>{t('translation:todo.context_menu.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language]
	)

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'remove':
				remove(id)
				break
		}
	})

	return (
		<div
			className={$cx('flex flex_column relative', styles._local)}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			<div
				className={$cx(
					'drag_wrap group border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10'
				)}
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
			</div>
			<ConfigProvider getPopupContainer={() => document.body}>
				<Dropdown
					destroyPopupOnHide
					trigger={['contextMenu']}
					overlayStyle={{ width: 90 }}
					menu={{ items: ContextMenu, onClick: onContextMenu }}
				>
					<div className='group_title' contentEditable ref={input} onInput={onInput}></div>
				</Dropdown>
			</ConfigProvider>
		</div>
	)
}

export default $app.memo(Index)
