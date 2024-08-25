import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical, Trash } from '@phosphor-icons/react'

import { useInput } from '../../hooks'
import styles from './index.css'

import type { MenuProps } from 'antd'
import type { IPropsGroupTitle } from '../../types'

const Index = (props: IPropsGroupTitle) => {
	const { sortable_props, item, index, update, remove } = props
	const { id, text } = item
	const { t, i18n } = useTranslation()
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = sortable_props
	const { input, onInput } = useInput({
		value: text,
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
							<span className='text ml_6'>{t('todo.context_menu.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language]
	)

	const onContextMenu = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'remove':
				remove({ id })
				break
		}
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter') {
			e.preventDefault()
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
					<div
						className='group_title'
						contentEditable='plaintext-only'
						ref={input}
						onInput={onInput}
						onKeyDown={onKeyDown}
					></div>
				</Dropdown>
			</ConfigProvider>
		</div>
	)
}

export default $app.memo(Index)
